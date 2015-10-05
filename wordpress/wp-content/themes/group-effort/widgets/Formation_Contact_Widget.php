<?php

/**
 * Adds Bootstrap_Slider_Widget widget.
 */
class Formation_Contact_Widget extends WP_Widget {
	
	protected $empty_fields = array();
	protected $error;
	protected $error_message;
	
	/**
	 * Register widget with WordPress.
	 */
	function __construct() {
		parent::__construct(
			'formation_contact_widget', // Base ID
			__('Formation Contact Widget', 'formation-contact'), // Name
			array( 'description' => __( 'A widget that builds a simple contact form', 'formation-contact' ), ) // Args
		);
		
		/* This hook and the corresponding function load the css file for the front end of the widget */

		add_action('wp_enqueue_scripts', 'formation_contact_scripts');
		
		function formation_contact_scripts() {
			wp_enqueue_style( 'formation-contact-css', get_template_directory_uri().'/widgets/css/formation-contact-widget.css' );
		}
		
		
		/* This hook and the corresponding function load the css file and JS file for the front end of the widget */
		
		add_action('admin_enqueue_scripts', 'formation_contact_admin_scripts');
		 
		function formation_contact_admin_scripts() {
			wp_enqueue_style( 'formation-contact-css', get_template_directory_uri().'/widgets/css/formation-contact-widget.css' );	
			wp_register_script('formation-contact-admin-js', get_template_directory_uri().'/widgets/js/formation-contact-widget.js', array('jquery'));
			wp_enqueue_script('formation-contact-admin-js');
		}
		
	}

	protected function validate_inputs( $inputs, $fields ) {
		$empty_required_fields = array();
		foreach ( $fields as $key => $field ) {			
			if ( $field[3] == true && $inputs['field-'.$key] == ''  ) {
				$empty_required_fields[] = $key;				
			}
		}
		if ( !empty( $empty_required_fields ) ) {
			$this->empty_fields = $empty_required_fields;
			throw new Exception ('Not all required fields are filled out.');
		}
	}
	
	protected function check_honeypot( $inputs ) {
		if ( $inputs['body'] == '' ) {
			return true;
		}
		else {
			return false;
		}
	}
	
	protected function send_email( $inputs, $fields, $email ) {
		
		$this->validate_inputs( $inputs, $fields );
		
		// if the honeypot is empty then continue, if not, the email will not be sent.
		if ( $this->check_honeypot( $inputs ) ) {
			$message = '';			

			foreach ( $fields as $key => $field ) {
				$message .= '<strong>'.$field[0].'</strong><br>'.$inputs['field-'.$key].'<br><br>';
			}
			
			$headers = "From: ".get_bloginfo( 'admin_email' )."\r\n";
			$headers .= "Reply-To: ". strip_tags($email) . "\r\n";
			$headers .= "MIME-Version: 1.0\r\n";
			$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

			if ( !( wp_mail( strip_tags($email) , 'Message from contact form', $message, $headers ) ) ) {
				throw new Exception ( 'Sorry, but it seems the email was not sent due to a technical error. Please try again later or contact us at <a href="mailto:'.$email.'" >'.$email.'</a>' );
			}
			
		}		
	}

	protected function submit_form( $inputs, $fields, $email ) {
		try {
			$this->send_email( $inputs, $fields, $email );
		} catch (Exception $e) {
			$this->error = true;
			$this->error_message = $e->getMessage();
			return false;
		}
		if ( $this->error != true ) {
			return true;
		}
	}
	
	protected function get_field_html( $key, $field ) {
		switch ( $field[1] ) {
			case 'text':
				$field_html = '<input type="text" name="field-'.$key.'" class="dep_contact_input '.$input_class.'">';
			break;
			case 'textarea':
				$field_html = '<textarea name="field-'.$key.'" class="dep_contact_input '.$input_class.'"></textarea>';
			break;
			case 'checkbox':				
				$field_html = '<input type="checkbox" name="field-'.$key.'" value="true"> '.$field[0];
			break;
			case 'select':
				$field_html = '<select name="field-'.$key.'" class="dep_contact_input '.$input_class.'">';
				foreach ( $field[2] as $option ) {
					$field_html .= '<option value="'.$option.'">'.$option.'</option>';	
				}
				$field_html .= '</select>';
			break;
		}
	return $field_html;
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
			
		if ( isset( $_POST['action'] ) && $_POST['action'] == 'formation_contact_submit' ) {
			if ( $this->submit_form( $_POST, json_decode( $instance['fields'] ), $instance['email'] ) ) {			
				require plugin_dir_path( dirname( __FILE__ ) ) . 'widgets/templates/Formation_Contact_Widget_Frontend_Thankyou.php';
			}
			else {
				require plugin_dir_path( dirname( __FILE__ ) ) . 'widgets/templates/Formation_Contact_Widget_Frontend.php';
			}
		}
		else {
			require plugin_dir_path( dirname( __FILE__ ) ) . 'widgets/templates/Formation_Contact_Widget_Frontend.php';
		}

	}

	/**
	 * Back-end widget form.
	 *
	 * @see WP_Widget::form()
	 *
	 * @param array $instance Previously saved values from database.
	 */
	public function form( $instance ) {
		require plugin_dir_path( dirname( __FILE__ ) ) . 'widgets/templates/Formation_Contact_Widget_Backend.php';		
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
		$instance['title'] = ( ! empty( $new_instance['title'] ) ) ? strip_tags( $new_instance['title'] ) : '';
		$instance['email'] = ( ! empty( $new_instance['email'] ) ) ? strip_tags( $new_instance['email'] ) : '';
		$instance['fields'] = ( ! empty( $new_instance['fields'] ) ) ? strip_tags( $new_instance['fields'] ) : '';
		return $instance;
	}

} // class Formation_Contact_Widget

?>