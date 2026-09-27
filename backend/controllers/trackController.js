const asyncHandler = require("../utils/asyncHandler");
const trackService = require("../services/trackService");

const createTrack = asyncHandler(async (req, res) => {
  const track = await trackService.createTrack(
    req.body,
    req.user
  );

  res.status(201).json({
    success: true,
    message: "Track created successfully",
    data: track,
  });
});

const getTracksByEvent = asyncHandler(async (req, res) => {
  const tracks = await trackService.getTracksByEvent(
    req.params.eventId
  );

  res.json({
    success: true,
    data: tracks,
  });
});

const getAllTracksByEvent = asyncHandler(async (req, res) => {
  const tracks = await trackService.getAllTracksByEvent(
    req.params.eventId
  );

  res.json({
    success: true,
    data: tracks,
  });
});

const getTrackById = asyncHandler(async (req, res) => {
  const track = await trackService.getTrackById(
    req.params.id
  );

  res.json({
    success: true,
    data: track,
  });
});

const updateTrack = asyncHandler(async (req, res) => {
  const track = await trackService.updateTrack(
    req.params.id,
    req.body,
    req.user
  );

  res.json({
    success: true,
    message: "Track updated successfully",
    data: track,
  });
});

const deleteTrack = asyncHandler(async (req, res) => {
  const result = await trackService.deleteTrack(
    req.params.id,
    req.user
  );

  res.json({
    success: true,
    ...result,
  });
});

module.exports = {
  createTrack,
  getTracksByEvent,
  getAllTracksByEvent,
  getTrackById,
  updateTrack,
  deleteTrack,
};