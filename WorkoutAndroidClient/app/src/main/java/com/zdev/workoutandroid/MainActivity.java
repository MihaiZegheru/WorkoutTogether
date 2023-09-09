package com.zdev.workoutandroid;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.EditText;
import android.widget.Toast;

import java.util.logging.Handler;

public class MainActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    EditText editIP;
    CardView cardView;

    @SuppressLint("SetJavaScriptEnabled")
    public void submitIp(View view) {
        WebView myWebView = (WebView) findViewById(R.id.myWebView);
        myWebView.getSettings().setAllowUniversalAccessFromFileURLs(true);
        myWebView.getSettings().setAllowContentAccess(true);
        myWebView.getSettings().setJavaScriptEnabled(true);


        editIP= (EditText) findViewById(R.id.IPadress);
        cardView = (CardView) findViewById(R.id.cardView);
        String url = editIP.getText().toString();

        myWebView.loadUrl(url);

        cardView.setVisibility(View.GONE);

        myWebView.setWebViewClient(new WebViewClient() {

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {

                view.loadUrl(url);
                return true;
            }
        });


    }

    private static final int TIME_INTERVAL = 2000;
    private long mBackPressed;

    @Override
    public void onBackPressed()
    {
        if (mBackPressed + TIME_INTERVAL > System.currentTimeMillis())
        {
            super.onBackPressed();
            return;
        }
        else { Toast.makeText(getBaseContext(), "Tap again to EXIT", Toast.LENGTH_SHORT).show(); }

        mBackPressed = System.currentTimeMillis();
    }





}

