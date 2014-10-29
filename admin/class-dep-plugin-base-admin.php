<?php
 
class DEP_Plugin_Base_Admin {
 
    private $version;
 
    public function __construct( $version ) {
        $this->version = $version;
    }
 
    public function enqueue_styles() {
 
        wp_enqueue_style(
            'dep-base-plugin-admin',
            plugin_dir_url( __FILE__ ) . 'css/dep-base-plugin-admin.css',
            array(),
            $this->version,
            FALSE
        );
 
    }
 
    public function add_meta_box() {
 
        add_meta_box(
            'dep-base-plugin-admin',
            'Single Post Meta Manager',
            array( $this, 'render_meta_box' ),
            'post',
            'normal',
            'core'
        );
 
    }
 
    public function render_meta_box() {
        require_once plugin_dir_path( __FILE__ ) . 'partials/single-dep-base-plugin.php';
    }
 
}