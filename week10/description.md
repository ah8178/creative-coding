# Week 10 — Gestural Control: Gesture Garden

## Concept
Gesture Garden is a webcam-based drawing that turns hand movement into a living visual composition. The goal is to make the hand feel like a brush: moving through the frame steers a field of petals, while a pinch gesture plants new blooms.

## Camera and input
The webcam is placed in front of the user at approximately hand height. The frame is composed around one hand, rather than the entire body, so the tracked points remain easy to see. The sketch uses ml5.js HandPose and the 21 hand landmarks.

## Gesture-to-visual mapping
- Index fingertip horizontal position controls the field's rotation.
- Index fingertip vertical position changes the hue.
- Distance between thumb tip and index fingertip controls bloom size.
- Bringing the thumb and index finger close together creates a new bloom.
- Each bloom is stored in an array, animated, and removed when its life runs out.

## Interaction and design choices
The camera image is shown faintly behind the generated forms so the user can understand the relationship between their hand and the visual result. The generated petals are intentionally more expressive than a literal skeleton overlay. The interaction is designed to be discovered through movement rather than through a complicated control panel.

## Bonus / technical notes
The sketch uses an array of Bloom objects and loops through the array to update and display each bloom. This keeps each flower's position, size, color, rotation, and lifetime together.

## Test notes to complete
- [ ] Test with different lighting and camera distances.
- [ ] Test with left and right hands.
- [ ] Record any tracking errors or lag.
- [ ] Add a screenshot or short video of the working sketch.

## AI assistance
An AI assistant helped draft and revise parts of the code and documentation. I need to be able to explain how the 21 landmarks are read, how the pinch distance is calculated, and how those values affect the drawing.