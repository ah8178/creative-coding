# Week 13 — Working with Models

## Project: Model Garden

This sketch is a starter interface for the course assignment. It uses an image classifier trained in Google Teachable Machine and webcam input. The predicted class changes the hue of a generative field; confidence affects the scale and movement of particles.

## Required personal work
1. Create an Image Project in [Teachable Machine](https://teachablemachine.withgoogle.com/).
2. Choose at least two classes that make sense for your concept.
3. Collect a varied dataset for each class. Change backgrounds, lighting, distance, and object position; do not train on one nearly identical set of images.
4. Train the model, test it with examples it has not seen, and add examples where it is confused.
5. Export the model using TensorFlow.js and host/upload it.
6. Paste the model URL into `MODEL_URL` in `sketch.js`.
7. Run the page with VS Code Live Server and allow webcam access.

## Interaction
The model's predicted class determines the color family of the visual field. Confidence influences particle size and movement. The viewer can change the input by presenting different objects or gestures to the camera.

## Reflection prompts
- What classes did you train, and why?
- How many examples did you collect for each class?
- Who or what appears in your training images?
- When does the model misclassify an input?
- Does the model work differently with changes in lighting, distance, background, or camera angle?
- What does the confidence score tell you—and what does it not tell you?

## Submission checklist
- [ ] Train your own model.
- [ ] Add the hosted model URL.
- [ ] Test all classes in the browser.
- [ ] Include a screenshot or short video.
- [ ] Explain your training process, inspiration, and how to interact with the program.
- [ ] Discuss limitations and possible bias.
- [ ] Cite Teachable Machine and any datasets or references.

## AI assistance
This starter code and documentation were drafted with AI assistance. Understand the model-loading and classification loop, revise the code, and acknowledge assistance according to the course requirements.