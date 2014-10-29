<?php
 
class DEP_Base_Plugin {
 
    protected $loader;
 
    protected $plugin_slug;
 
    protected $version;
 
    public function __construct() {
 
        $this->plugin_slug = 'dep-base-plugin-slug';
        $this->version = '0.1.0';
 
    }
 
    private function load_dependencies() {
 
    }
 
    private function define_admin_hooks() {
 
    }
 
    public function run() {
 
    }
 
    public function get_version() {
        return $this->version;
    }
 
}