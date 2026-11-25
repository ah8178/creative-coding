# Week 13 — Working with Models

**Course brief:** Train your own classifier with [Google Teachable Machine](https://teachablemachine.withgoogle.com/) using image, sound, or body-pose data, then incorporate it into a creative sketch.

## Starter concept: Model Garden

This starter uses an **image classifier** and webcam input. The predicted class determines the visual field's hue; confidence influences the scale and movement of particles.

## Set up your own model

1. Open [Teachable Machine](https://teachablemachine.withgoogle.com/).
2. Create an Image Project.
3. Choose at least two meaningful classes. Collect varied examples for each class; do not rely on only one background, lighting condition, or object position.
4. Train and test the model. Add examples if it confuses the classes.
5. Export the model using TensorFlow.js and choose the hosted/upload option.
6. Copy the model URL and paste it into `MODEL_URL` near the top of `sketch.js`. Keep the trailing slash.
7. Open `index.html` with VS Code Live Server and allow webcam access.

## Before submitting

- [ ] Train and test your own model.
- [ ] Add your model URL to the sketch.
- [ ] Explain what classes you trained and how you collected examples.
- [ ] Describe how the model's output changes the sketch.
- [ ] Discuss errors, bias, or situations where the model is uncertain.
- [ ] Include a screenshot or short video.
- [ ] Cite Teachable Machine and any datasets or references you used.

## AI assistance disclosure

This starter interface was created with AI assistance. You must train your own model, review and revise the sketch, understand the classification loop, and follow your instructor's attribution requirements.