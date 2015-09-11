<?php
 
class Group_Effort_Admin {
 
    private $version;
 
    public function __construct( $version ) {
        $this->version = $version;
    }
 
    public function enqueue_styles() {
 
        wp_enqueue_style(
            'group-effort-admin',
            plugin_dir_url( __FILE__ ) . 'css/group-effort-admin.css',
            array(),
            $this->version,
            FALSE
        );
 
    }

	public function group_effort_add_roles() {
		remove_role( 'group_effort' );
	   add_role( 'group_effort', 'Group Effort User', array( 'level_0' => true ) );
    }
   
 
 	public function group_effort_add_post_types() {
				
		$group_effort_labels = array(
			'name'               => _x( 'Group Efforts', 'post type general name', 'game_of_newps' ),
			'singular_name'      => _x( 'Group Effort', 'post type singular name', 'game_of_newps' ),
			'menu_name'          => _x( 'Group Efforts', 'admin menu', 'game_of_newps' ),
			'name_admin_bar'     => _x( 'Group Efforts', 'add new on admin bar', 'game_of_newps' ),
			'add_new'            => _x( 'Group Effort', 'group-effort', 'game_of_newps' ),
			'add_new_item'       => __( 'Add New Group Effort', 'game_of_newps' ),
			'new_item'           => __( 'New Group Effort', 'game_of_newps' ),
			'edit_item'          => __( 'Edit Group Effort', 'game_of_newps' ),
			'view_item'          => __( 'View Group Effort', 'game_of_newps' ),
			'all_items'          => __( 'All Group Efforts', 'game_of_newps' ),
			'search_items'       => __( 'Search Group Efforts', 'game_of_newps' ),
			'parent_item_colon'  => __( 'Parent Group Efforts:', 'game_of_newps' ),
			'not_found'          => __( 'No Extra Credit Points found.', 'game_of_newps' ),
			'not_found_in_trash' => __( 'No Group Efforts found in Trash.', 'game_of_newps' ),
		);
	
		$group_effort_args = array(
			'labels'             => $group_effort_labels,
			'description'		 => 'A Group Effort',
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_nav_menus'	 => false,
			'show_in_menu'       => true,
			'show_in_admin_bar'	 => false,
			'query_var'          => 'group-effort',
			'rewrite'            => false,
			'capability_type'    => 'post',
			'has_archive'        => true,
			'hierarchical'       => false,
			'menu_position'      => null,
			'supports'           => array( 'title', 'comments', 'excerpt' ),
			'can_export'		 => 'true'
		);

		register_post_type( 'group-effort', $group_effort_args );		
		
	}
	
	public function group_effort_add_meta() {
		//add_meta_box("_contributors","Daten des Produkts","produkt_meta","produkt","normal","high");
		register_meta( 'group-effort', 'contributors', array( $this , 'sanitize_contributors' ) );
		//register_meta( 'group-effort', 'contributors', array( $this , 'sanitize_contributors' ) );
		 
	}
	
	public function sanitize_contributors( $data ) {
		return $data;
	}

}