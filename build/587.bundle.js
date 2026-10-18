"use strict";
(self["webpackChunkruhi_global_citizenship_remotion"] = self["webpackChunkruhi_global_citizenship_remotion"] || []).push([["587"], {
2990(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  VideoMattingQueueProcessor: () => (VideoMattingQueueProcessor)
});
/* import */ var _index_a94vwgt9_mjs__rspack_import_0 = __webpack_require__(6692);
/* import */ var _index_ts7drhwc_mjs__rspack_import_1 = __webpack_require__(7449);
/* import */ var _index_swet14kx_mjs__rspack_import_2 = __webpack_require__(8137);
/* import */ var _index_7shemw90_mjs__rspack_import_6 = __webpack_require__(8335);
/* import */ var _index_gbgac2ar_mjs__rspack_import_3 = __webpack_require__(6834);
Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* import */ var react__rspack_import_5 = __webpack_require__(6540);






// src/components/RenderQueue/VideoMattingQueueProcessor.tsx


var VideoMattingQueueProcessor = () => {
  const {
    markVideoMattingJobDone,
    markVideoMattingJobFailed,
    markVideoMattingJobCancelled,
    markVideoMattingJobSaving,
    getAbortController,
    setProcessVideoMattingJobCallback,
    updateVideoMattingJobProgress
  } = (0,react__rspack_import_5.useContext)(_index_swet14kx_mjs__rspack_import_2/* .RenderQueueContext */.x7);
  const processJob = (0,react__rspack_import_5.useCallback)(async (job) => {
    const { signal } = getAbortController(job.id);
    let output = null;
    let processingError = null;
    try {
      signal.throwIfAborted();
      updateVideoMattingJobProgress(job.id, {
        detail: null,
        message: "Checking WebGPU support...",
        value: 0
      });
      const support = await Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model: job.model });
      signal.throwIfAborted();
      if (!support.supported) {
        throw new Error(support.detailedReason);
      }
      await (0,_index_7shemw90_mjs__rspack_import_6/* .loadModelForJob */.k)({
        signal,
        model: job.model,
        progressStart: 0,
        progressSpan: 0.2,
        isModelCached: (model) => Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model }),
        loadModel: async (model, onProgress) => {
          await Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
            signal,
            model,
            onProgress: (progress) => onProgress(progress.progress)
          });
          await Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model, signal });
        },
        updateProgress: (progress) => updateVideoMattingJobProgress(job.id, {
          ...progress,
          detail: null
        })
      });
      const mattingOptions = {
        signal,
        src: job.src,
        model: job.model,
        videoBitrate: job.videoBitrate,
        onProgress: (progress) => {
          updateVideoMattingJobProgress(job.id, {
            detail: progress.stage === "finalizing" ? `Processed ${progress.processedFrames} ${progress.processedFrames === 1 ? "frame" : "frames"}` : `Processed ${progress.processedFrames} ${progress.processedFrames === 1 ? "frame" : "frames"} · ${Math.round(progress.progress * 100)}%`,
            message: progress.stage === "finalizing" ? "Finalizing video..." : "Removing background...",
            value: 0.2 + (progress.progress ?? 1) * 0.65
          });
        }
      };
      output = await Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({
        ...mattingOptions,
        audio: job.audio
      });
      if (output === null) {
        throw new Error("Video matting produced no output.");
      }
      signal.throwIfAborted();
      updateVideoMattingJobProgress(job.id, {
        detail: null,
        message: "Saving video...",
        value: 0.88
      });
      const video = await output.video.getBlob();
      signal.throwIfAborted();
      markVideoMattingJobSaving(job.id);
      await video.arrayBuffer().then((contents) => (0,_index_gbgac2ar_mjs__rspack_import_3/* .writeStaticFile2 */.g4)({ contents, filePath: job.outName }));
      if (job.target !== null) {
        updateVideoMattingJobProgress(job.id, {
          detail: null,
          message: "Replacing video source...",
          value: 0.97
        });
        const browserStudioOperations = (0,_index_a94vwgt9_mjs__rspack_import_0/* .getBrowserStudioOperations */.P3)();
        const request = {
          fileName: job.target.fileName,
          nodePath: job.target.nodePath.nodePath,
          src: job.outName
        };
        const replaceSource = browserStudioOperations?.replaceVideoSource;
        if (browserStudioOperations && !replaceSource) {
          throw new Error("Browser Studio cannot replace the video source.");
        }
        const response = replaceSource ? await replaceSource(request) : await (0,_index_a94vwgt9_mjs__rspack_import_0/* .callApi */.px)("/api/replace-video-source", request);
        if (!response.success) {
          throw new Error(response.reason);
        }
      }
    } catch (error) {
      processingError = error instanceof Error ? error : new Error(String(error));
    }
    if (output) {
      await Promise.allSettled([output.video.dispose()]);
    }
    try {
      await Object(function __rspack_missing_module() { var e = new Error("Cannot find module '@remotion/video-matting'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())({ model: job.model });
    } catch {}
    if (signal.aborted) {
      markVideoMattingJobCancelled(job.id);
    } else if (processingError) {
      markVideoMattingJobFailed(job.id, processingError);
    } else {
      markVideoMattingJobDone(job.id);
    }
  }, [
    getAbortController,
    markVideoMattingJobCancelled,
    markVideoMattingJobSaving,
    markVideoMattingJobDone,
    markVideoMattingJobFailed,
    updateVideoMattingJobProgress
  ]);
  (0,react__rspack_import_5.useEffect)(() => {
    setProcessVideoMattingJobCallback(processJob);
    return () => setProcessVideoMattingJobCallback(null);
  }, [processJob, setProcessVideoMattingJobCallback]);
  return null;
};



},
8335(__unused_rspack___webpack_module__, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  k: () => (loadModelForJob)
});
// src/components/RenderQueue/load-model-for-job.ts
var loadModelForJob = async ({
  isModelCached,
  loadModel,
  model,
  signal,
  progressSpan,
  progressStart,
  updateProgress
}) => {
  signal.throwIfAborted();
  const cached = await isModelCached(model);
  signal.throwIfAborted();
  await loadModel(model, (progress) => {
    signal.throwIfAborted();
    const percentage = progress === null ? "" : ` ${Math.round(progress * 100)}%`;
    updateProgress({
      message: `${cached ? "Loading" : "Downloading"} ${model}${percentage}`,
      value: progressStart + (progress ?? 0) * progressSpan
    });
  });
  signal.throwIfAborted();
};




},

}]);
//# sourceMappingURL=587.bundle.js.map