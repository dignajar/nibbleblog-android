package com.nibbleblog.nibbleblog;

import android.os.Bundle;
import android.view.Menu;
import com.nibbleblog.nibbleblog.R;

import org.apache.cordova.DroidGap;

public class MainActivity extends DroidGap {

    @Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }
    
}
