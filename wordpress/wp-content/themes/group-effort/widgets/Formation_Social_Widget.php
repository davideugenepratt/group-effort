<?php

/**
 * Adds Bootstrap_Slider_Widget widget.
 */
 
class Formation_Social_Widget extends WP_Widget {
	
	/**
	 * Register widget with WordPress.
	 */
	 
	function __construct() {
		parent::__construct(
			'formation_social_widget', // Base ID
			__('Formation Social Widget', 'formation'), // Name
			array( 'description' => __( 'A widget for a list of social links', 'formation' ), ) // Args
		);
		
		/* This hook and the corresponding function load the css file for the front end of the widget */

		add_action('wp_enqueue_scripts', 'formation_social_scripts');
		
		function formation_social_scripts() {
			wp_enqueue_style( 'formation-social-css', get_template_directory_uri().'/widgets/css/formation-social-widget.css' );
		}
		
		
		/* This hook and the corresponding function load the css file and JS file for the front end of the widget */
		
		add_action('admin_enqueue_scripts', 'formation_social_admin_scripts');
		 
		function formation_social_admin_scripts() {
			wp_enqueue_style( 'formation-social-css', get_template_directory_uri().'/widgets/css/formation-social-widget.css' );	
			wp_register_script('formation-social-admin-js', get_template_directory_uri().'/widgets/js/formation-social-widget.js', array('jquery'));
			wp_enqueue_script('formation-social-admin-js');
		}
		
	}

	/**
	 * Front-end display of widget.
	 *
	 * @see WP_Widget::widget()
	 *
	 * @param array $args     Widget arguments.
	 * @param array $instance Saved values from database.
	 */
	public function widget( $args, $instance ) {
				
		include_once('templates/Formation_Social_Widget_Frontend.php');
		
	}

	/**
	 * Back-end widget form.
	 *
	 * @see WP_Widget::form()
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		
		include('templates/Formation_Social_Widget_Backend.php');
		
	}

	/**
	 * Sanitize widget form values as they are saved.
	 *
	 * @see WP_Widget::update()
	 *
	 * @param array $new_instance Values just sent to be saved.
	 * @param array $old_instance Previously saved values from database.
	 *
	 * @return array Updated safe values to be saved.
	 */
	public function update( $new_instance, $old_instance ) {
		
		$instance = array();

		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		
		$instance['services'] = ( ! empty( $new_instance['services'] ) ) ? strip_tags( $new_instance['services'] ) : '';

		return $instance;
		
	}

} // class Formation_Social_Widget

?>