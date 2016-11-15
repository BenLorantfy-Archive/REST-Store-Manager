/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package client;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import javafx.application.Application;
import javafx.geometry.HPos;
import javafx.geometry.VPos;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.Region;
import javafx.scene.paint.Color;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;

import java.io.File;
import java.io.FileInputStream;

import netscape.javascript.JSObject;
 
    class Handler implements HttpHandler {
    
        
        
        @Override
        public void handle(HttpExchange t) {
           String path = t.getRequestURI().getPath();
           if(path.equals("/")){
               path = "/index.html";
           }


            // String path = System.getProperty("user.dir")
            try{
                int code = 200;
                String filePath = System.getProperty("user.dir") + "/www/" + path;
                String contentType = java.net.URLConnection.guessContentTypeFromName(filePath);
                //String contentType = java.nio.file.Files.probeContentType(java.nio.file.Paths.get(filePath));
                
                System.out.println(contentType);
                File file = new File(filePath);
                String document = "";
                
                if(file.exists() && !file.isDirectory()) { 
                  FileInputStream fis = new FileInputStream(file);
                    byte[] data = new byte[(int) file.length()];
                    fis.read(data);
                    fis.close();                  
                    document = new String(data, "UTF-8");
                }else{
                    code = 404;
                    document = "404";
                }

                
                if(contentType != null){
                    t.getResponseHeaders().set("Content-Type", contentType);
                }
                //t.getResponseHeaders().set("Content-Type", contentType);
                t.sendResponseHeaders(code, 0); // http://stackoverflow.com/a/33857650
                
               
                OutputStream os = t.getResponseBody();
                os.write(document.getBytes());
                os.close();                  
            }catch(Exception e){
               System.out.println("IO Failed: " + e.getMessage());
            }       

        }
        
    }
 
public class Client extends Application {
    private Scene scene;
    private static HttpServer server = null;
    
    @Override public void start(Stage stage) {
        // create the scene
        stage.setTitle("Client");
        scene = new Scene(new Browser(),1100,800, Color.web("#666970"));
        stage.setScene(scene);
        scene.getStylesheets().add("webviewsample/BrowserToolbar.css");        
        stage.show();
    }
    
    @Override
    public void stop(){
        System.out.println("Stage is closing");
        server.stop(0);
    }
 
    public static void main(String[] args){
        // [ Start the Web Server ]
        // Neccessary to use web server over file:/// to get around same-origin policy restrictions
        
        try{
            System.out.println("Creating Http Server...");
            server = HttpServer.create(new InetSocketAddress(3784), 0);
            server.createContext("/", new Handler());
            server.setExecutor(null); // creates a default executor
            server.start();
            System.out.println("Created Http Server on port 3784...");
        }catch(Exception e){
            System.out.println("Failed to create HTTP Server: " + e.getMessage());
        }
        
        
        launch(args);
    }
}

class Browser extends Region {
 
    final WebView browser = new WebView();
    final WebEngine webEngine = browser.getEngine();
    
    public void log(){
        
    }
    
    // http://stackoverflow.com/questions/28687640/javafx-8-webengine-how-to-get-console-log-from-javascript-to-system-out-in-ja
    public class JavaBridge
    {
        public void log(String text)
        {
            System.out.println(text);
        }
    }
     
    public Browser() {
        JSObject window = (JSObject) webEngine.executeScript("window");
        JavaBridge bridge = new JavaBridge();
        window.setMember("java", bridge); 
        webEngine.executeScript("console.log = function(message)\n" +
        "{\n" +
        "    java.log(message);\n" +
        "};");
        
        //apply the styles
        getStyleClass().add("browser");
        // load the web page
//        String path = System.getProperty("user.dir");  
//        path.replace("\\\\", "/");  
//        path +=  "/www/index.html";  
        String path = "http://localhost:3784/";
        //String path = "http://localhost:3784/test.html";
//       String path = "https://www.google.ca/";
//String path = "https://parall.ax/products/jspdf";
//String path = "https://mozilla.github.io/pdf.js/web/viewer.html";
        webEngine.load(path); 
        
        webEngine.executeScript("setTimeout(function(){ if (!document.getElementById('FirebugLite')){E = document['createElement' + 'NS'] && document.documentElement.namespaceURI;E = E ? document['createElement' + 'NS'](E, 'script') : document['createElement']('script');E['setAttribute']('id', 'FirebugLite');E['setAttribute']('src', 'https://getfirebug.com/' + 'firebug-lite.js' + '#startOpened');E['setAttribute']('FirebugLite', '4');(document['getElementsByTagName']('head')[0] || document['getElementsByTagName']('body')[0]).appendChild(E);E = new Image;E['setAttribute']('src', 'https://getfirebug.com/' + '#startOpened');} },5000)"); 

        //add the web view to the scene
        getChildren().add(browser);
    }
    
    private Node createSpacer() {
        Region spacer = new Region();
        HBox.setHgrow(spacer, Priority.ALWAYS);
        return spacer;
    }
 
    @Override protected void layoutChildren() {
        double w = getWidth();
        double h = getHeight();
        layoutInArea(browser,0,0,w,h,0, HPos.CENTER, VPos.CENTER);
    }
 
    @Override protected double computePrefWidth(double height) {
        return 750;
    }
 
    @Override protected double computePrefHeight(double width) {
        return 500;
    }
}