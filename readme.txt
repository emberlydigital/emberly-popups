=== Emberly Popups ===
Contributors: emberlydigital
Tags: popup, modal, overlay, wordpress popup
Requires at least: 5.0
Tested up to: 6.8
Stable tag: 1.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Lightweight, accessible popups called via functions. By developers, for developers!

== Description ==

Emberly Popups is a lightweight WordPress function that creates accessible, customizable popup modals.

Features include:
- Open automatically after a delay
- Show only once per user with cookie- or session-based control
- Control how often the popup appears using an interval
- Support for shortcodes inside popup content
- Adjustable popup width and padding
- Accessible HTML structure with ARIA roles and attributes

== Installation ==

1. Include the `emberly_popup()` function in your theme or plugin.
2. Call `emberly_popup()` where you want the popup to appear.
3. Make sure `assets/icons/close.svg` exists for the close button.

== Debugging ==

Want to know exactly when a popup loads, opens, sets cookies, or locks the scroll?

Use the `debug` parameter to enable verbose logging for a specific popup. This outputs helpful information to the browser console for troubleshooting purposes.

To enable:

```php
emberly_popup(
    title: 'Example',
    content: '<p>Debugging is on!</p>',
    id: 'debug-popup',
    debug: true // 👈 enable debug mode
);

== Usage ==

Calling a popup:

Popups can only be called via PHP functions. The most ideal scenario is to call them using PHP 8+, which allows you to be specific about which attributes you're utilizing.

Example using **PHP 8+ named arguments**:

```php
emberly_popup(
    title: '',
    content: '<p>Thanks for visiting our site. Don\'t miss our latest offers!</p>',
    id: 'welcome-popup',
    width: '50rem',
    padding: '3rem',
    echo: true,
    output_shortcodes: true,
    auto_open: true,
    delay: 2000,
    show_once: false,
    persistence_method: 'session',
    show_interval_ms: 1800000 // 30 minutes in milliseconds
);
```

Example for **PHP 7 and earlier** (ordered arguments):

```php
emberly_popup(
    '', // $title
    '<p>Thanks for visiting our site. Don\'t miss our latest offers!</p>',
    'category-survey-popup', // $id
    '50rem', // $width
    '3rem', // $padding
    true, // $echo
    true, // $output_shortcodes
    true, // $auto_open
    2000, // $delay
    false, // $show_once
    'session', // $persistence_method
    1800000 // $show_interval_ms
);
```

== Triggering Popups ==

You can open popups automatically by using the auto_open parameter.

Want to open with a click? Popups can be opened manually by adding a trigger element anywhere on your page with the `em-popup-trigger-id` attribute. The value should match the ID you assigned to the popup via the `$id` parameter in your `emberly_popup()` call.

### Example

```html
<a href="#" em-popup-trigger-id="welcome-popup">Open Welcome Popup</a>

Parameters:

| Parameter | Type | Default | Description |
|:--|:--|:--|:--|
| $title | string | '' | Title text of the popup. |
| $content | string | '' | Content HTML inside the popup. |
| $id | string | '' | Unique ID for the popup. |
| $width | string | '60rem' | Maximum width of the popup. |
| $padding | string | '3rem' | Padding inside the popup. |
| $echo | bool | true | Echo the popup or return it as a string. |
| $output_shortcodes | bool | false | Run shortcodes inside the content. |
| $auto_open | bool | false | Open automatically after a delay. |
| $delay | int | 0 | Auto-open delay in milliseconds. |
| $show_once | bool | false | Only show once per session or cookie, depending on persistence. |
| $persistence_method | string | 'cookie' | Where to store whether the popup was shown. Options: 'cookie' or 'session'. |
| $show_interval_ms | int | 0 | How often (in milliseconds) the popup should show again. 0 disables repeat showing. |

== Frequently Asked Questions ==

= What happens if no ID is set? =

Each popup should have a unique ID for proper functioning, especially when using cookies, sessions, or auto-open behavior.

= Can I use shortcodes inside the popup content? =

Yes, just set `$output_shortcodes` to `true`.

== Changelog ==

= 1.0 =
* Initial release.

== Upgrade Notice ==

= 1.0 =
First public release.

== Screenshots ==

No screenshots available.
