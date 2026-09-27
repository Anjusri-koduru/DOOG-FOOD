const asyncHandler = require("../utils/asyncHandler");
const prizeService = require("../services/prizeService");

const createPrize = asyncHandler(async (req, res) => {
  const prize = await prizeService.createPrize(
    req.body,
    req.user
  );

  res.status(201).json({
    success: true,
    message: "Prize created successfully",
    data: prize,
  });
});

const getPrizesByEvent = asyncHandler(async (req, res) => {
  const prizes = await prizeService.getPrizesByEvent(
    req.params.eventId
  );

  res.json({
    success: true,
    data: prizes,
  });
});

const getAllPrizesByEvent = asyncHandler(async (req, res) => {
  const prizes = await prizeService.getAllPrizesByEvent(
    req.params.eventId
  );

  res.json({
    success: true,
    data: prizes,
  });
});

const getPrizeById = asyncHandler(async (req, res) => {
  const prize = await prizeService.getPrizeById(
    req.params.id
  );

  res.json({
    success: true,
    data: prize,
  });
});

const updatePrize = asyncHandler(async (req, res) => {
  const prize = await prizeService.updatePrize(
    req.params.id,
    req.body,
    req.user
  );

  res.json({
    success: true,
    message: "Prize updated successfully",
    data: prize,
  });
});

const deletePrize = asyncHandler(async (req, res) => {
  const result = await prizeService.deletePrize(
    req.params.id,
    req.user
  );

  res.json({
    success: true,
    ...result,
  });
});

module.exports = {
  createPrize,
  getPrizesByEvent,
  getAllPrizesByEvent,
  getPrizeById,
  updatePrize,
  deletePrize,
};