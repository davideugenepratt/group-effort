<?php
 
class DEP_Plugin_Base_Admin {
 
    private $version;
 
    public function __construct( $version ) {
        $this->version = $version;
    }
 
    public function enqueue_styles() {
 
        wp_enqueue_style(
            'dep-plugin-base-admin',
            plugin_dir_url( __FILE__ ) . 'css/dep-plugin-base-admin.css',
            array(),
            $this->version,
            FALSE
        );
 
    }
 
}