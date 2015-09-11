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
		$this->loader->add_action( 'wp_ajax_nopriv_ge_authenticate', $ajax, 'group_effort_not_logged_in' );
		$this->loader->add_action( 'wp_ajax_ge_authenticate', $ajax, 'group_effort_logged_in' ); 
		$this->loader->add_action( 'wp_ajax_ge_login', $ajax, 'group_effort_logged_in' ); 
		$this->loader->add_action( 'wp_ajax_nopriv_ge_login', $ajax, 'group_effort_login' );
		$this->loader->add_action( 'wp_ajax_ge_logout', $ajax, 'group_effort_logout' ); 
		$this->loader->add_action( 'wp_ajax_nopriv_ge_logout', $ajax, 'group_effort_logout' );
		$this->loader->add_action( 'wp_ajax_nopriv_ge_register', $ajax, 'group_effort_register' );
		$this->loader->add_action( 'wp_ajax_ge_addEffort', $ajax, 'group_effort_add_effort' );
		$this->loader->add_action( 'wp_ajax_ge_getEffort', $ajax, 'group_effort_get_effort' );
		$this->loader->add_action( 'wp_ajax_ge_getEffortComments', $ajax, 'group_effort_get_effort_comments' );
		$this->loader->add_action( 'wp_ajax_ge_addEffortComment', $ajax, 'group_effort_add_effort_comment' );
		$this->loader->add_action( 'wp_ajax_ge_getEffortTasks', $ajax, 'group_effort_get_effort_tasks' );
		$this->loader->add_action( 'wp_ajax_ge_addEffortTask', $ajax, 'group_effort_add_effort_task' );
		$this->loader->add_action( 'wp_ajax_ge_dibs', $ajax, 'group_effort_dibs' );
		$this->loader->add_action( 'wp_ajax_ge_changeTaskStatus', $ajax, 'group_effort_change_task_status' );
		$this->loader->add_action( 'wp_ajax_ge_allEfforts', $ajax, 'group_effort_all_efforts' );
		$this->loader->add_action( 'wp_ajax_ge_leaveEffort', $ajax, 'group_effort_leave_effort' );
		$this->loader->add_action( 'wp_ajax_ge_allFriends', $ajax, 'group_effort_all_friends' );
		$this->loader->add_action( 'wp_ajax_ge_addFriend', $ajax, 'group_effort_add_friend' );
		$this->loader->add_action( 'wp_ajax_ge_acceptRequest', $ajax, 'group_effort_accept_request' );
		$this->loader->add_action( 'wp_ajax_ge_removeFriend', $ajax, 'group_effort_remove_friend' );
		$this->loader->add_action( 'wp_ajax_ge_editContributors', $ajax, 'group_effort_edit_contributors' );
		
	}

 
    public function run() {
        $this->loader->run();
    }
 
    public function get_version() {
        return $this->version;
    }
 
}