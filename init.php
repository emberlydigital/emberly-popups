<?php
/*
   Plugin Name: Emberly Popups
   Author URI: https://emberlydigital.com/
   description: Lightweight, accessible popups called via functions. By developers, for developers!
   Version: 1.1
   Author: Emberly Digital
   License: GPL2
   */
   


if ( ! defined( 'ABSPATH' ) ) {
    die; // Die if accessed directly
}

/* Set up custom post types and taxonomies */
include( plugin_dir_path( __FILE__ ) . 'lib/functions.php');

function em_popups_add_scripts(){
	// wp_register_script( 'em_popups_my_cool_script', plugins_url( 'script.js', __FILE__ ), array( 'jquery' ), '1.0', true );
	// wp_enqueue_script( 'em_popups_my_cool_script' );

	wp_enqueue_style( 'em_popups_my_styles', plugins_url( 'lib/styles.css', __FILE__ ), '', '1.0' );

	$mtime = filemtime( plugin_dir_path( __FILE__ ) . 'lib/pop.js' );
	wp_register_script( 'em_popups_my_scripts', plugins_url( 'lib/pop.js', __FILE__ ), array( 'jquery' ), $mtime, true );
  wp_enqueue_script( 'em_popups_my_scripts' );
}
add_action( 'wp_enqueue_scripts', 'em_popups_add_scripts' );

?>
