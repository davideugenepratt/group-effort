<?php
/*
 * Plugin Name:       Group-Effort
 * Plugin URI:        http://github.com/davideugenepratt/group-effort.git
 * Description:       Single Post Meta Manager displays the post meta data associated with a given post.
 * Version:           0.1.0
 * Author:            David Pratt
 * Author URI:        http://www.davideugenepratt.com
 * Text Domain:       dep-plugin-base-locale
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Domain Path:       /languages
 */
 
if ( ! defined( 'WPINC' ) ) {
    die;
}

require_once plugin_dir_path( __FILE__ ) . 'includes/class-group-effort.php';
 
function run_group_effort() {
 
    $group_effort = new Group_Effort();
    $group_effort->run();
 
}
 
run_group_effort();
