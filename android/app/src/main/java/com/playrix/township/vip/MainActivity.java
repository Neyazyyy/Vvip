package com.playrix.township.vip;

import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.Settings;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStreamReader;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;

    private static final String APP_URL = "https://ais-pre-7kzdaidl53ztksazjvi7cn-891024645025.europe-west2.run.app/";
    private static final String TOWNSHIP_PKG = "com.playrix.township";
    private static final String TARGET_DB = "/data/data/" + TOWNSHIP_PKG + "/databases/nedata.db";
    private static final String TARGET_DIR = "/data/data/" + TOWNSHIP_PKG + "/databases";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.addJavascriptInterface(new WebAppInterface(this), "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (progressBar != null) progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if (progressBar != null) progressBar.setVisibility(View.GONE);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("https://t.me/") || url.startsWith("tg://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
                    try {
                        Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                        startActivity(intent);
                        return true;
                    } catch (Exception ignored) {}
                }
                return false;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (progressBar != null) {
                    progressBar.setProgress(newProgress);
                    if (newProgress == 100) {
                        progressBar.setVisibility(View.GONE);
                    }
                }
            }
        });

        webView.loadUrl(APP_URL);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    public class WebAppInterface {
        private final Context mContext;

        public WebAppInterface(Context context) {
            this.mContext = context;
        }

        @JavascriptInterface
        public boolean isNativeApp() {
            return true;
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
                while ((line = is.readLine()) != null) output.append(line).append("\n");
                while ((line = es.readLine()) != null) output.append("[ERR] ").append(line).append("\n");
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
                        "monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1\n";

                String res = executeRootCommand(cmd);
                return !res.startsWith("ERROR");
            } catch (Exception e) {
                return false;
            }
        }

        @JavascriptInterface
        public void launchTownship() {
            executeRootCommand("monkey -p " + TOWNSHIP_PKG + " -c android.intent.category.LAUNCHER 1");
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
}
