import Feedback from "../models/Feedback.js";

// Submit Feedback
export const submitFeedback = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment are required." });
    }

    const feedback = await Feedback.create({
      name: name && name.trim() ? name.trim() : "Anonymous",
      rating: Number(rating),
      comment,
      user: req.user ? req.user._id : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your valuable feedback!",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Feedbacks (Admin Only)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    
    const totalReviews = feedbacks.length;
    const averageRating = totalReviews > 0 
      ? (feedbacks.reduce((acc, item) => acc + item.rating, 0) / totalReviews).toFixed(1) 
      : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating,
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Feedback (Admin Only)
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found." });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
      id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};