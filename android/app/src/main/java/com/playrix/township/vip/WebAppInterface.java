package com.playrix.township.vip;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;

public class WebAppInterface {
    private final Context mContext;
    private static final String TOWNSHIP_PKG = "com.playrix.township";
    private static final String TARGET_DB = "/data/data/" + TOWNSHIP_PKG + "/databases/nedata.db";
    private static final String TARGET_DIR = "/data/data/" + TOWNSHIP_PKG + "/databases";
    private static final String BACKUP_DIR = "/storage/emulated/0/a_TS_Files";

    public WebAppInterface(Context context) {
        this.mContext = context;
    }

    @JavascriptInterface
    public boolean isNativeApp() {
        return true;
    }

    @JavascriptInterface
    public String getAppVersion() {
        return "v108-FIX-2 (Native Superuser Bridge)";
    }

    @JavascriptInterface
    public String getDeviceId() {
        try {
            String androidId = Settings.Secure.getString(mContext.getContentResolver(), Settings.Secure.ANDROID_ID);
            if (androidId != null && !androidId.isEmpty()) {
                return "DEV-" + androidId.toUpperCase().substring(0, Math.min(8, androidId.length()));
            }
        } catch (Exception ignored) {}
        return "DEV-TSVIP8889";
    }

    @JavascriptInterface
    public boolean isRootAvailable() {
        try {
            Process process = Runtime.getRuntime().exec(new String[]{"su", "-c", "id"});
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line = reader.readLine();
            process.waitFor();
            return line != null && line.contains("uid=0");
        } catch (Exception e) {
            return false;
        }
    }

    @JavascriptInterface
    public String executeRootCommand(String command) {
        StringBuilder output = new StringBuilder();
        try {
            Process p = Runtime.getRuntime().exec("su");
            DataOutputStream os = new DataOutputStream(p.getOutputStream());
            BufferedReader is = new BufferedReader(new InputStreamReader(p.getInputStream()));
            BufferedReader es = new BufferedReader(new InputStreamReader(p.getErrorStream()));

            os.writeBytes(command + "\n");
            os.writeBytes("exit\n");
            os.flush();

            String line;
            while ((line = is.readLine()) != null) {
                output.append(line).append("\n");
            }
            while ((line = es.readLine()) != null) {
                output.append("[ERR] ").append(line).append("\n");
            }
            p.waitFor();
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
        return output.toString().trim();
    }

    @JavascriptInterface
    public boolean directInjectNedata(String nedataDbContent) {
        try {
            File tempFile = new File(mContext.getExternalCacheDir(), "nedata_temp.db");
            FileOutputStream fos = new FileOutputStream(tempFile);
            fos.write(nedataDbContent.getBytes());
            fos.close();

            String cmd = "am force-stop " + TOWNSHIP_PKG + "\n" +
                    "mkdir -p " + TARGET_DIR + "\n" +
                    "cp -f " + tempFile.getAbsolutePath() + " " + TARGET_DB + "\n" +
                    "rm -f " + TARGET_DIR + "/nedata.db-journal " + TARGET_DIR + "/nedata.db-wal " + TARGET_DIR + "/nedata.db-shm\n" +
                    "chmod 660 " + TARGET_DB + "\n" +
                    "chmod 771 " + TARGET_DIR + "\n" +
                    "chown -R $(stat -c '%u:%g' /data/data/" + TOWNSHIP_PKG + ") " + TARGET_DIR + "\n" +
                    "restorecon -R " + TARGET_DIR + "\n" +
                    "monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1 || am start -n " + TOWNSHIP_PKG + "/com.playrix.township.lib.GameApplication\n";

            String res = executeRootCommand(cmd);
            return !res.startsWith("ERROR");
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @JavascriptInterface
    public String unbanDeviceAndReset() {
        String cmd = "am force-stop " + TOWNSHIP_PKG + "\n" +
                "rm -rf /data/data/" + TOWNSHIP_PKG + "/shared_prefs/*\n" +
                "rm -rf /data/data/" + TOWNSHIP_PKG + "/databases/*\n" +
                "rm -rf /data/data/" + TOWNSHIP_PKG + "/files/*\n" +
                "monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1\n";
        return executeRootCommand(cmd);
    }

    @JavascriptInterface
    public String createAccountBackup(String backupName) {
        String cleanName = (backupName != null && !backupName.isEmpty()) ? backupName : "TS-VIP_Backup_" + System.currentTimeMillis();
        String cmd = "am force-stop " + TOWNSHIP_PKG + "\n" +
                "mkdir -p " + BACKUP_DIR + "\n" +
                "cd /data/data/" + TOWNSHIP_PKG + " && tar -czf " + BACKUP_DIR + "/" + cleanName + ".tar.gz databases files shared_prefs\n";
        return executeRootCommand(cmd);
    }

    @JavascriptInterface
    public String restoreAccountBackup(String backupFileName) {
        String cmd = "am force-stop " + TOWNSHIP_PKG + "\n" +
                "cd /data/data/" + TOWNSHIP_PKG + " && tar -xzf " + BACKUP_DIR + "/" + backupFileName + "\n" +
                "chmod -R 771 /data/data/" + TOWNSHIP_PKG + "\n" +
                "chown -R $(stat -c '%u:%g' /data/data/" + TOWNSHIP_PKG + ") /data/data/" + TOWNSHIP_PKG + "\n" +
                "monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1\n";
        return executeRootCommand(cmd);
    }

    @JavascriptInterface
    public void launchTownship() {
        try {
            Intent launchIntent = mContext.getPackageManager().getLaunchIntentForPackage(TOWNSHIP_PKG);
            if (launchIntent != null) {
                mContext.startActivity(launchIntent);
            } else {
                executeRootCommand("monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1 || am start -n " + TOWNSHIP_PKG + "/com.playrix.township.lib.GameApplication");
            }
        } catch (Exception e) {
            executeRootCommand("monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1");
        }
    }

    @JavascriptInterface
    public void forceStopTownship() {
        executeRootCommand("am force-stop " + TOWNSHIP_PKG);
    }

    @JavascriptInterface
    public void copyToClipboard(String text) {
        try {
            ClipboardManager clipboard = (ClipboardManager) mContext.getSystemService(Context.CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("Township VIP", text);
            clipboard.setPrimaryClip(clip);
        } catch (Exception ignored) {}
    }

    @JavascriptInterface
    public void showToast(String message) {
        try {
            Toast.makeText(mContext, message, Toast.LENGTH_SHORT).show();
        } catch (Exception ignored) {}
    }
}
