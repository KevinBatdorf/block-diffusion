=== Block Diffusion - Generate images from text prompts  ===
Contributors:      kbat82
Tags:              block, stable diffusion, ai, prompt, artificial intelligence, generate, pokemon, dall-e, midjourney
Tested up to:      6.1
Stable tag:        0.5.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Generate unique images from text prompts using machine learning, all in the cloud.

== Description ==

A new era of content creation is here. With machine learning and advanced models, we are now capable of creating unique images based on text prompts alone. We are only lmiited by our imagination. Block Diffusion lets you use artifical intelligence to unlock your creativity and give unique experiences to your visitors.

This plugin interfaces with the Replicate API and allows you to run open-source models via their cloud API. Add the block to a page and select a model to enter your API token.

Semi interactive demo at [https://www.block-diffusion.com/](https://www.block-diffusion.com/)

= Features =
- Stable Diffusion model
- Text to Pokémon model
- Multiple outputs
- Image input with basic controls
- Download, copy, or import into the editor
- Prompt suggestion + preview

= Pro version =
 All pro features will be added to this version on wordpress.org. You may [sponsor the project on GitHub](https://github.com/sponsors/KevinBatdorf) (there are monthly and one-time payment options). Thank you.

= Upcoming Features =
- Add an image mask to only generate specific areas
- View your prediction history

= More Info =
- Follow [@kevinbatdorf](https://twitter.com/kevinbatdorf) on Twitter
- View on [GitHub](https://github.com/KevinBatdorf/block-diffusion)

= Terms and Privacy =
This plugin provides an interface to the Replicate API and requires you have an active account at replicate.com with an active API token. This plugin is not affiliated with Replicate and only uses their public Http API. Your servers speak directly with replicate.com.
- [Replicate terms](https://replicate.com/terms)
- [Replicate privacy policy](https://replicate.com/privacy)

We also offer additional features on top of the Replicate API, such as prompt/output sharing (opt in) and prompt inspiration.
- [Block Diffusion terms](https://www.block-diffusion.com/terms)
- [Block Diffusion privacy policy](https://www.block-diffusion.com/privacy)

== Installation ==

1. Activate the plugin through the 'Plugins' screen in WordPress

== Screenshots ==

1. A view of the interface
2. Choose from various models to run

== Changelog ==

= 0.5.0 - 2022-11-06 =
- Feature: Add interactive image input 🚀
- Tweak: Update types to support new num_output format
- Tweak: Adjust spacing on model switch ui
- Fix: Fix nested scroll bars showing

= 0.4.0 - 2022-10-10 =
- Feature: Support multiple outputs
- Feature: Add download and copy buttons
- Tweak: The output UI is separate now from the input UI
- Fix: Fixed a bug where the focus state wouldn't expand the model card

= 0.3.0 - 2022-10-09 =
- Feature: Add support for image to Pokémon generation
- Tweak: Various UI changes

= 0.2.0 - 2022-10-05 =
- Feature: Help with prompt ideas and inspiration (opt in)
- Feature: Prompt sharing with the community (opt in)
- Feature: Added settings modal to manage preferences
- Tweak: Removed intermediary modal
- Tweak: UI improvements

= 0.1.8 - 2022-09-15 =
- Tweak: Update height and width positioning
- Tweak: Add middleware to grab token from the db (or body)
- Testing: Adds login e2e tests

= 0.1.7 - 2022-09-15 =
- Update auto inject to be more reliable
- Tweak styling to avoid some theme conflicts

= 0.1.6 - 2022-09-14 =
- Refactor out login from middleware into a basic gate pattern
- Add "API Token" link on the plugins page that will open the app
- Make the login view the first view

= 0.1.5 - 2022-09-13 =
- Add better error handling when logging in

= 0.1.4 - 2022-09-13 =
- Update scrolling style for md widths
- Update login mobile view layout

= 0.1.3 - 2022-09-13 =
- Update block label in editor

= 0.1.2 - 2022-09-13 =
- Update plugin name and description text
- Fix bug where the image block isn't mounted by the time the opener event fires
- Fix mobile scrolling bug

= 0.1.1 - 2022-09-12 =
- Update block.json information

= 0.1.0 - 2022-09-12 =
- Initial release
