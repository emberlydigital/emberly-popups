<?php
/***
 * Emberly Popup Functions
 *
 * @package Emberly
 * @subpackage Emberly Popups
 * @since 1.0
 * @version 1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	die; // Die if accessed directly
}

/**
 * Display a popup
 *
 * @param string $title The title of the popup.
 * @param string $content The content of the popup.
 * @param string $id The ID of the popup.
 * @param bool $open Whether the popup should be open by default.
 * @param string $width The width of the popup.
 */
function em_popup( string $title = '', string $content = '', string $id = '', string $width = '60rem', string $padding = '3rem', bool $echo = true, bool $output_shortcodes = false, bool $auto_open = false, int $delay = 0, bool $show_once = false, string $persistence_method = 'cookie', int $show_interval_ms = 0, bool $debug = false ) {

	// If we're in the admin, bail early.
	if ( is_admin() ) {
		return '';
	}

	// If show_once is true, and method is 'cookie', check if the popup was already shown.
	if ( $show_once && $persistence_method === 'cookie' ) {
		if ( isset( $_COOKIE[ $id ] ) ) {
			return '';
		}
	}

	// Get the icon markup.
	$icon_file_path = plugin_dir_path( __DIR__ ) . 'assets/icons/close.svg';
	$icon_markup = file_exists( $icon_file_path ) ? file_get_contents( $icon_file_path ) : '';

	// Title markup.
	$title_markup = $title ? '<h2 class="em-popup-title">' . esc_html( $title ) . '</h2>' : '';

	// Overlay classes.
	$overlay_classes = array( 'em-popup-overlay' );
	if ( $auto_open ) {
		$overlay_classes[] = 'em-auto-open';
	}
	if ( $show_once ) {
		$overlay_classes[] = 'em-show-once';
		$overlay_classes[] = 'em-persistence-method-' . esc_attr( $persistence_method );
	}	

	$data_attributes = array(
		'data-em-popup-id' => $id,
		'data-em-delay' => $delay,
		'data-em-popup-debug' => $debug ? 'true' : 'false',
	);
	
	if ( $show_interval_ms > 0 ) {
		$data_attributes['data-em-show-interval-ms'] = $show_interval_ms;
	}	

	// Start the popup HTML (sanitize the outer structure only)
	$popup_start = '<div class="' . esc_attr( implode( ' ', $overlay_classes ) ) . '" ' . em_build_data_attributes( $data_attributes ) . '>
			<div class="em-popup em-popup-bg" id="em-popup-' . esc_attr( $id ) . '" style="max-width: ' . esc_attr( $width ) . ';" data-em-popup-id="' . esc_attr( $id ) . '" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="popup-title-' . esc_attr( $id ) . '">
				<button class="em-popup-close" aria-label="Close popup">
					' . $icon_markup . '
				</button>
				<div class="em-popup-content" style="padding: ' . esc_attr( $padding ) . ';">
					' . $title_markup . '
					<div class="em-popup-text">';

	// Close the popup HTML structure
	$popup_end .= '</div></div></div></div>';

	// Return or echo
	if ( $echo ) {
		echo wp_kses( $popup_start, em_allowed_popup_html() )  . ( $output_shortcodes ? do_shortcode( $content ) : wp_kses_post( $content, em_allowed_popup_html() ) ) . wp_kses( $popup_end, em_allowed_popup_html() );
	} else {
		return wp_kses( $popup_start, em_allowed_popup_html() )  . ( $output_shortcodes ? do_shortcode( $content ) : wp_kses_post( $content, em_allowed_popup_html() ) ) . wp_kses( $popup_end, em_allowed_popup_html() );
	}
}

/***
 * Build data attributes for the popup
 *
 * @param array $attributes The attributes to build.
 * @return string The data attributes.
 */
function em_build_data_attributes( $attributes ) {
    $output = array();
    foreach ( $attributes as $key => $value ) {
        $output[] = esc_attr( $key ) . '="' . esc_attr( $value ) . '"';
    }
    return implode( ' ', $output );
}

/**
 * Allowed HTML for popups, including SVGs.
 *
 * @return array
 */
function em_allowed_popup_html() {
	return array_merge(
		wp_kses_allowed_html( 'post' ),
		array(
			'svg' => array(
				'class' => true,
				'xmlns' => true,
				'width' => true,
				'height' => true,
				'viewbox' => true,
				'aria-hidden' => true,
				'focusable' => true,
				'role' => true,
				'fill' => true,
				'xml:space' => true,
				'preserveaspectratio' => true,
			),
			'path' => array(
				'd' => true,
				'fill' => true,
				'fill-rule' => true,
				'clip-rule' => true,
			),
			'g' => array(
				'fill' => true,
			),
			'img' => array(
				'src'     => true,
				'alt'     => true,
				'width'   => true,
				'height'  => true,
				'class'   => true,
				'loading' => true,
				'decoding' => true,
				'srcset'  => true,
				'sizes'   => true,
			),
		)
	);
}
