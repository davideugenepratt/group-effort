<?php
 
class Group_Effort {
 
    protected $loader;
 
    protected $plugin_slug;
 
    protected $version;
 
    public function __construct() {
 
        $this->plugin_slug = 'group-effort';
        $this->version = '0.2.0';
 
        $this->load_dependencies();
        $this->define_admin_hooks();
		$this->define_ajax_hooks();
 
    }
 
    private function load_dependencies() {
 
        require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-group-effort-admin.php';
		require_once plugin_dir_path( __FILE__ ) . 'class-group-effort-ajax.php';
        require_once plugin_dir_path( __FILE__ ) . 'class-group-effort-loader.php';
        $this->loader = new Group_Effort_Loader();
 
    }
 
    private function define_admin_hooks() {
 
        $admin = new Group_Effort_Admin( $this->get_version() );
        $this->loader->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_styles' );
		$this->loader->add_action( 'activate_group-effort/group-effort.php', $admin, 'group_effort_add_roles' );  		
		$this->loader->add_action( 'init', $admin, 'group_effort_add_post_types' ); 
		$this->loader->add_action( 'admin-init', $admin, 'group_effort_register_meta' );		

    }

	private function define_ajax_hooks() {
 
        $ajax = new Group_Effort_Ajax();
		$this->loader->add_filter( 'auth_cookie_expiration', $ajax, 'extend_cookie' ); 
        $this->loader->add_filter('comment_flood_filter', $ajax, 'remove_flood_filter');
		$this->loader->add_action( 'wp_ajax_nopriv_group_effort', $ajax, 'not_logged_in' );
		$this->loader->add_action( 'wp_ajax_group_effort', $ajax, 'ajax_controller' ); 		
		
	}

 
    public function run() {
        $this->loader->run();
    }
 
    public function get_version() {
        return $this->version;
    }
 
}