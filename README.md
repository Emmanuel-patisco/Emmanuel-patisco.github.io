
# Portfolio Site

This repository contains the source for a simple one page portfolio.

## Contact Form

The contact form on the site is for demonstration only and does not actually send emails or store messages. If you need a working form, connect the JavaScript handler in `index.html` to a backend service or an email API.
=======
# Portfolio Website


This repository contains the source code for my portfolio website.

## License

This project is licensed under the [MIT License](LICENSE).
=======
This repository contains a simple portfolio website built with a single `index.html` file styled using [Tailwind CSS](https://tailwindcss.com/). It showcases an example mechanical engineer profile with sections for an about page, skills, project highlights and a contact form.

## Running locally

Because the site is completely static, you can view it directly in a browser:

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd Emmanuel-patisco.github.io
   ```
2. Open `index.html` in your preferred browser.

Alternatively you can serve it locally, which is helpful for testing with relative paths:

```bash
python3 -m http.server
```
Then visit `http://localhost:8000` in your browser.

## Customization

All content is inside `index.html`. Replace any placeholder names, dates and images to personalize the site:

- Update the `<title>` and navigation brand from "John Doe" to your name.
- Swap the profile photo (`https://placehold.co/400x400...`) and project images (`https://placehold.co/600x400...`) with your own images or files in an `assets/` directory.
- Edit the text in the About, Skills and Project Portfolio sections to match your experience.
- Update contact details (email, phone and social links) in the contact section and footer.

## Contact form caveat

The included contact form only simulates a successful submission using JavaScript. It does **not** send any emails by default. To receive messages you will need to connect the form to a service such as [Formspree](https://formspree.io/), EmailJS, or your own backend.

## Deploying to GitHub Pages (optional)

1. Push the repository to GitHub.
2. In the repository's **Settings** → **Pages**, choose the branch (usually `main`) and save.
3. After a few moments your portfolio will be available at `https://<your-username>.github.io/<repository-name>/`.

Feel free to customize further and enjoy your new online portfolio!


