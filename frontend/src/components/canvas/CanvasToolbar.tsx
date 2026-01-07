import React, { useState, useEffect } from "react";
import { Flex, Tooltip, Spinner } from "@radix-ui/themes";
import { Eraser, Video, ArrowLeft, Zap } from "lucide-react";
import { Editor } from "tldraw";
import { toast } from "sonner";
import { useFrameGraphContext } from "../../contexts/FrameGraphContext";
import { apiFetch } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

interface CanvasToolbarProps {
  onClear: () => void;
  editorRef: React.RefObject<Editor | null>;
}

export const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  onClear,
  editorRef,
}) => {
  const navigate = useNavigate();
  const frameGraph = useFrameGraphContext();
  const [isMerging, setIsMerging] = useState(false);
  const { user } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      setCredits(null);
      return;
    }

    // Fetch initial credits
    const fetchCredits = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("credits")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        setCredits(data?.credits ?? 0);
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits(0);
      }
    };

    fetchCredits();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`credits-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "users",
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.credits === "number") {
            setCredits(payload.new.credits);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleMergeVideos = async () => {
    if (!editorRef.current) {
      toast.error("Editor not ready. Please wait a moment and try again.");
      return;
    }

    const editor = editorRef.current;

    // Get selected shapes
    const selectedIds = editor.getSelectedShapeIds();

    // Find the selected frame
    const selectedFrame = selectedIds
      .map((id) => editor.getShape(id))
      .find((shape) => shape?.type === "aspect-frame");

    if (!selectedFrame) {
      toast.error("Please select a frame to merge videos from.");
      return;
    }

    // Get the path from root to the selected frame (reverse traversal)
    const path = frameGraph.getFramePath(selectedFrame.id);

    if (path.length === 0) {
      toast.error("No path found for the selected frame.");
      return;
    }

    // Collect video URLs from arrows in the path
    // The path is ordered from root to selected frame, so videoUrls will be in correct order
    const videoUrls: string[] = [];

    // Traverse the path (skip the root frame, start from the first child)
    for (let i = 1; i < path.length; i++) {
      const node = path[i];

      // Get the arrow for this node
      if (node.arrowId) {
        const arrow = editor.getShape(node.arrowId);
        if (arrow && arrow.type === "arrow") {
          const videoUrl = arrow.meta?.videoUrl as string | undefined;
          if (videoUrl && arrow.meta?.status === "done") {
            videoUrls.push(videoUrl);
          }
        }
      }
    }

    if (videoUrls.length === 0) {
      toast.error("No videos found in the path from root to selected frame.");
      return;
    }

    if (videoUrls.length < 2) {
      toast.error("At least 2 videos are required for merging.");
      return;
    }

    // Call backend API to merge videos
    setIsMerging(true);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await apiFetch(`${backendUrl}/api/jobs/video/merge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ video_urls: videoUrls }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      const result = await response.json();
      const mergedVideoUrl = result.video_url;

      if (!mergedVideoUrl) {
        throw new Error("No video URL returned from server");
      }

      toast.success(`Successfully merged ${videoUrls.length} videos!`);

      // Download the merged video
      try {
        const videoResponse = await fetch(mergedVideoUrl);
        const videoBlob = await videoResponse.blob();
        const url = window.URL.createObjectURL(videoBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `merged-video-${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Video downloaded successfully!");
      } catch (downloadError) {
        console.error("Error downloading video:", downloadError);
        toast.error(
          "Video merged but download failed. You can access it at the URL in the console.",
        );
      }
    } catch (error) {
      console.error("Error merging videos:", error);
      toast.error(
        `Failed to merge videos: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="relative group">
         {/* Prismatic Glow Behind */}
         <div className="absolute -inset-1 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 rounded-full opacity-40 blur-md group-hover:opacity-70 transition duration-500 animate-tilt"></div>
         
         {/* Toolbar Content */}
         <Flex
          gap="2"
          p="2"
          className="relative rounded-full border border-white/60 shadow-xl shadow-indigo-100/40 backdrop-blur-xl bg-white/80 flex items-center pr-4"
        >
          <Tooltip content="Go Back">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-white text-gray-500 hover:text-black transition-all border border-gray-100 hover:border-gray-200 shadow-sm"
            >
              <ArrowLeft size={18} />
            </button>
          </Tooltip>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          <Tooltip content="Clear Canvas">
            <button
              onClick={onClear}
              className="px-4 py-2 flex items-center gap-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 transition-all border border-red-100/50 hover:border-red-200 text-sm font-bold"
            >
              <Eraser size={16} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </Tooltip>

          <Tooltip content="Merge Videos">
            <button
              onClick={handleMergeVideos}
              disabled={isMerging}
              className={`px-4 py-2 flex items-center gap-2 rounded-full transition-all border text-sm font-bold ${
                isMerging 
                  ? "bg-gray-100 text-gray-400 border-transparent cursor-not-allowed" 
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 border-emerald-100/50 hover:border-emerald-200"
              }`}
            >
              {isMerging ? <Spinner size="1" /> : <Video size={16} />}
              <span className="hidden sm:inline">{isMerging ? "Merging..." : "Merge"}</span>
            </button>
          </Tooltip>
          
          {user && (
            <>
              <div className="w-px h-6 bg-gray-200 mx-1"></div>
              <Tooltip content="Credits">
                <button
                  onClick={() => open("/pricing", "_blank")}
                  className="px-4 py-2 flex items-center gap-2 rounded-full bg-violet-50 hover:bg-violet-100 text-violet-600 hover:text-violet-700 transition-all border border-violet-100/50 hover:border-violet-200 text-sm font-bold"
                >
                  <Zap size={16} className="fill-current" />
                  <span className="hidden sm:inline">{credits ?? "..."} Credits</span>
                </button>
              </Tooltip>
            </>
          )}
        </Flex>
      </div>
    </div>
  );
};
