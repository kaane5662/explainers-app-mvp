import React, { Dispatch, SetStateAction, useState, useEffect, useCallback } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { router, useRouter } from "expo-router";
import { Trash2, Edit, Send, Loader, ChevronDown, ThumbsUp, X } from "lucide-react-native";
import clsx from "clsx";
import moment from "moment";

const MAX_CHARS = 250;

interface User {
  id: string;
  name: string;
  imageUrl?: string;
}

interface CommentType {
  id: string;
  text: string;
  user_id: string;
  user: User;
  created: string;
  edited?: boolean;
  likes: number;
  parent_id?: string;
  _expandParent?: boolean;
  explainerPodcast_id?: string;
  explainerVideo_id?: string;
}

interface CommentsProps {
  id: string;
  user: User | null;
  isPodcast: boolean;
  visible: boolean;
  onClose: CallableFunction;
}

interface CommentProps {
  comment: CommentType;
  isOwner: boolean;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  replies: CommentType[];
  level: number;
  postComment: (parentId: string, replyText: string) => Promise<void>;
  user: User | null;
  route: string;
}

export default function Comments({ id, user, isPodcast, visible, onClose }: CommentsProps) {
  const route = !isPodcast ? "videos" : "podcasts";
//   const [data, setData] = useState<{ comments: CommentType[]; error?: string } | null>(null);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const [isPosting, setIsPosting] = useState<boolean>(false);

  const postComment = useCallback(async (parentId?: string, replyText?: string) => {
    if (!user || isPosting) {
      return;
    }

    setIsPosting(true);
    setLoading(true);
    console.log("positing comment", text)
    const data = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ text: text || replyText, [route === "podcasts" ? "podcastId" : "videoId"]: id, parentId }),
    }).then((res) => res.json());
    // console.log("positing comment")
    const { success, newComment, error } = data;
    if (!newComment) {
      setIsPosting(false);
    //   Alert.alert('Error', error || 'An error occurred while posting the comment.');
      return;
    }
    console.log(newComment)


    setComments((prev) => {
      const newComments = [newComment, ...prev];
      if (parentId) {
        const parentComment = prev.find((c) => c.id === parentId);
        if (parentComment) {
          const repliesCount = newComments.filter((c) => c.parent_id === parentId).length;
          if (repliesCount > 2) {
            newComment._expandParent = true;
          }
        }
      }
      return newComments;
    });
    setLoading(false);

    setText("");
    setIsPosting(false);
  }, [user, isPosting, text, route, id]);

  const commentsByParentId = comments.reduce<Record<string, CommentType[]>>((acc, comment) => {
    const parentId = comment.parent_id || "root";
    if (!acc[parentId]) {
      acc[parentId] = [];
    }
    acc[parentId].push(comment);
    return acc;
  }, {});

  const rootComments = commentsByParentId["root"] || [];

  const getRootComments = async()=>{
    setLoading(true)
    const data = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${route}/${id}/comments`, {
        method: "GET",
        // body: JSON.stringify({ text: replyText || text, [route === "podcasts" ? "podcastId" : "videoId"]: id, parentId }),
      }).then((res) => res.json());
    //   console.log("rooot comments",data)
      
    setComments(data.comments)
    setLoading(false)
  }
  useEffect(() => {
    // if (!data) {
    //   return;
    // }

    // const { comments, error } = data;
    // if (error) {
    //   return;
    // }
    getRootComments()
    setComments(comments);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => onClose()}
    >
    <View className="flex-1 justify-center bg-black/30  items-center">
        
      <ScrollView className={clsx("flex flex-col rounded-3xl bg-white gap-6 w-full max-h-[500px] p-4 absolute bottom-0")}>
        <TouchableOpacity onPress={() => onClose()} className="absolute -z-20 right-1 p-1 pb-4 px-4">
          <X size={25} />
        </TouchableOpacity>
        <Text
          className={clsx(
            "font-semibold text-xl",
            "text-slate-900 dark:text-slate-100",
            "flex-row items-center gap-2"
          )}
        >
          {comments === null ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <Text>Loading...</Text>
            </>
          ) : (
            <>
              <Text>{comments.length} Comments</Text>
            </>
          )}
        </Text>
        <View
          className={clsx(
            "flex-row gap-4",
            "border-b mt-4 border-slate-200 dark:border-slate-700",
            "pb-4"
          )}
        >
          {user && user.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className={clsx("w-10 h-10", "rounded-full", "object-cover")}
              alt={user.name}
            />
          ) : (
            <View
              className={clsx(
                "w-10 h-10",
                "rounded-full",
                "bg-blue-100 dark:bg-blue-900",
                "flex-row items-center justify-center",
                "text-blue-600 dark:text-blue-300",
                "font-medium text-lg"
              )}
            >
              <Text>{user?.name?.[0]?.toUpperCase() || "?"}</Text>
            </View>
          )}
          <View className={clsx("flex-1 flex-col gap-1")}>
            {!user ? (
              <TouchableOpacity
                onPress={() => router.push("(auth)/signup")}
                className={clsx(
                  "w-full text-left",
                  "text-slate-500 dark:text-slate-400",
                  "hover:text-slate-900 dark:hover:text-slate-100",
                  "transition-colors duration-200",
                  "text-sm"
                )}
              >
                <Text>Sign up to comment</Text>
              </TouchableOpacity>
            ) : (
              <View className={clsx("flex-col gap-2")}>
                <View
                  className={clsx(
                    "relative",
                    "border border-slate-200 dark:border-slate-700",
                    "rounded-lg",
                    "p-2",
                    "focus-within:ring-1 focus-within:ring-blue-500/20",
                    "focus-within:border-blue-500",
                    "transition-all duration-200"
                  )}
                >
                  <TextInput
                    value={text}
                    multiline
                    numberOfLines={3}
                    onChangeText={(newText) => {
                      if (newText.length <= MAX_CHARS) {
                        setText(newText);
                      }
                    }}
                    className={clsx(
                      "w-full min-h-[60px]",
                      "bg-transparent",
                      "text-slate-900 dark:text-slate-100",
                      "placeholder:text-slate-500 dark:placeholder:text-slate-400",
                      "focus:outline-none",
                      "text-sm",
                      "resize-none"
                    )}
                    placeholder="Write your comment..."
                    maxLength={MAX_CHARS}
                    editable={!isPosting}
                  />
                  <View
                    className={clsx(
                      "absolute bottom-2 right-2 z-10",
                      "flex-row items-center gap-2"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-xs",
                        "text-slate-500 dark:text-slate-400",
                        text.length >= MAX_CHARS && "text-red-500 dark:text-red-400"
                      )}
                    >
                      {text.length}/{MAX_CHARS}
                    </Text>
                    <TouchableOpacity
                      onPress={() => postComment(undefined, text)}
                      disabled={!text.trim() || isPosting}
                      className={clsx(
                        "px-3 py-1.5 rounded-md",
                        "text-sm font-medium",
                        "text-black dark:text-white",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "transition-all duration-200",
                        "flex-row items-center gap-1.5"
                      )}
                    >
                      {isPosting ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <Text>Posting...</Text>
                        </>
                      ) : (
                        <>
                          <Send size={16} className="w-3.5 h-3.5" />
                          <Text>Post</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        <View className={clsx("flex-col gap-8 mt-4 mb-8")}>
          {rootComments.map((comment) => (
            <Comment
              route={route}
              key={comment.id}
              comment={comment}
              isOwner={user?.id === comment.user_id}
              setComments={setComments}
              replies={commentsByParentId[comment.id] || []}
              level={0}
              postComment={postComment}
              user={user}
            />
          ))}
        </View>
      </ScrollView>
    </View>
    </Modal>
  );
}

function Comment({
  comment,
  isOwner,
  setComments,
  replies,
  level,
  postComment,
  user,
  route
}: CommentProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingText, setEditingText] = useState<string>(comment.text);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isPostingReply, setIsPostingReply] = useState<boolean>(false);
  const [showAllReplies, setShowAllReplies] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(comment.likes);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  const MAX_CHARS = 250;

  const explainerId = route === "podcasts" ? comment.explainerPodcast_id : comment.explainerVideo_id;

  useEffect(() => {
    async function checkLikeStatus() {
      if (!user) return;

      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/${route}/comments/${comment.id}/likes/check`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (data.success) {
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    }

    checkLikeStatus();
  }, [comment.id, user]);

  useEffect(() => {
    if (comment._expandParent && replies.length > 2) {
      setShowAllReplies(true);
      setComments((prev) =>
        prev.map((c) =>
          c.id === comment.id ? { ...c, _expandParent: undefined } : c
        )
      );
    }
  }, [comment._expandParent, replies.length, setComments, comment.id]);

  const visibleReplies = showAllReplies ? replies : [];
  const hasReplies = replies.length > 0;

  async function deleteComment(commentId: string) {
    if (!isOwner || isDeleting) {
      return;
    }

    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);

    const { success, error } = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/${route}/${explainerId}/comments`,
      {
        method: "DELETE",
        body: JSON.stringify({ id: commentId }),
      }
    ).then((res) => res.json());
    if (!success) {
      setIsDeleting(false);
      return;
    }

    setComments((prev) => prev.filter((com) => com.id !== commentId));
    setIsDeleting(false);
  }

  async function editComment(commentId: string) {
    setIsSaving(true);

    const { success, error } = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/${route}/${explainerId}/comments`,
      {
        method: "PUT",
        body: JSON.stringify({ id: commentId, text: editingText }),
      }
    ).then((res) => res.json());
    if (!success) {
      setIsSaving(false);
      return;
    }

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, text: editingText, edited: true } : comment
      )
    );
    setIsSaving(false);
    setIsEditing(false);
    setEditingText("");
  }

  async function handleReply() {
    if (!replyText.trim() || isPostingReply) {
      return;
    }
    setIsPostingReply(true);
    await postComment(comment.id, replyText);
    setIsReplying(false);
    setReplyText("");
    setIsPostingReply(false);
  }

  async function toggleLike() {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/${route}/comments/likes`, {
        method: isLiked ? "DELETE" : "POST",
        body: JSON.stringify({ commentId: comment.id }),
      });

      const data = await response.json();

      if (data.success) {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        setComments((prev) =>
          prev.map((c) =>
            c.id === comment.id
              ? { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 }
              : c
          )
        );
      }
    } catch (error) {
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <View
      style={{ marginLeft: level > 0 ? `${level * 2}rem` : 0 }}
      className={clsx("flex-col gap-4")}
    >
      <View className={clsx("flex-row gap-4")}>
        <TouchableOpacity onPress={() => router.push(`/profiles/${comment.user.id}`)}>
          {comment.user.imageUrl ? (
            <Image
              source={{ uri: comment.user.imageUrl }}
              className={clsx("w-10 h-10", "rounded-full", "object-cover")}
              alt={comment.user.name}
            />
          ) : (
            <View
              className={clsx(
                "w-10 h-10",
                "rounded-full",
                "bg-blue-100 dark:bg-blue-900",
                "flex-row items-center justify-center",
                "text-blue-600 dark:text-blue-300",
                "font-medium text-lg"
              )}
            >
              <Text>{comment.user.name?.[0]?.toUpperCase() || "?"}</Text>
            </View>
          )}
        </TouchableOpacity>
        <View className={clsx("flex-1 flex-col gap-1")}>
          <View className={clsx("flex-row gap-2 items-center", "flex-wrap")}>
            <TouchableOpacity
              onPress={() => router.push(`/profiles/${comment.user.id}`)}
              className={clsx(
                "font-medium text-sm",
                "text-slate-900 dark:text-slate-100",
                "hover:underline"
              )}
            >
              <Text>{comment.user.name}</Text>
            </TouchableOpacity>
            <Text className={clsx("text-xs", "text-slate-500 dark:text-slate-400")}>
              {moment(comment.created).fromNow()}
            </Text>
            {comment.edited && (
              <Text className={clsx(
                "text-xs",
                "text-slate-500 dark:text-slate-400",
                "italic"
              )}>
                Edited
              </Text>
            )}
            {isOwner && (
              <View className={clsx("flex-row gap-2", "ml-auto")}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditing(true);
                    setEditingText(comment.text);
                  }}
                  className={clsx(
                    "p-1 rounded-full",
                    "text-slate-500 hover:text-slate-900",
                    "dark:text-slate-400 dark:hover:text-slate-100",
                    "hover:bg-slate-100 dark:hover:bg-dark2",
                    "transition-all duration-200"
                  )}
                  title="Edit"
                >
                  <Edit size={16} className="w-4 h-4" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteComment(comment.id)}
                  className={clsx(
                    "p-1 rounded-full",
                    "text-slate-500 hover:text-red-500",
                    "dark:text-slate-400 dark:hover:text-red-400",
                    "hover:bg-slate-100 dark:hover:bg-dark2",
                    "transition-all duration-200"
                  )}
                  title="Delete"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 size={16} className="w-4 h-4" />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
          {isEditing ? (
            <View className={clsx("flex-col gap-2", "mt-2")}>
              <View
                className={clsx(
                  "relative",
                  "border border-slate-200 dark:border-slate-700",
                  "rounded-lg",
                  "p-2",
                  "focus-within:ring-1 focus-within:ring-blue-500/20",
                  "focus-within:border-blue-500",
                  "transition-all duration-200"
                )}
              >
                <TextInput
                  value={editingText}
                  multiline={true}
                  numberOfLines={3}
                  onChangeText={(newText) => {
                    if (newText.length <= MAX_CHARS) {
                      setEditingText(newText);
                    }
                  }}
                  className={clsx(
                    "w-full min-h-[60px]",
                    "bg-transparent",
                    "text-slate-900 dark:text-slate-100",
                    "placeholder:text-slate-500 dark:placeholder:text-slate-400",
                    "focus:outline-none",
                    "text-sm",
                    "resize-none"
                  )}
                  placeholder="Edit your comment..."
                  maxLength={MAX_CHARS}
                />
                <View
                  className={clsx(
                    "absolute bottom-2 right-2",
                    "flex-row items-center gap-2"
                  )}
                >
                  <Text
                    className={clsx(
                      "text-xs",
                      "text-slate-500 dark:text-slate-400",
                      editingText.length >= MAX_CHARS &&
                        "text-red-500 dark:text-red-400"
                    )}
                  >
                    {editingText.length}/{MAX_CHARS}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(false)}
                    className={clsx(
                      "px-3 py-1.5 rounded-md",
                      "text-sm font-medium",
                      "text-slate-600 hover:text-slate-900",
                      "dark:text-slate-400 dark:hover:text-slate-100",
                      "hover:bg-slate-100 dark:hover:bg-dark2",
                      "transition-all duration-200"
                    )}
                  >
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => editComment(comment.id)}
                    disabled={!editingText.trim() || isSaving}
                    className={clsx(
                      "px-3 py-1.5 rounded-md",
                      "text-sm font-medium",
                      "text-black dark:text-white",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "transition-all duration-200",
                      "flex-row items-center gap-1.5"
                    )}
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-3.5 h-3.5 animate-spin" />
                        <Text>Saving...</Text>
                      </>
                    ) : (
                      <>
                        <Send size={16} className="w-3.5 h-3.5" />
                        <Text>Save</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text
                className={clsx(
                  "text-sm text-slate-900 dark:text-slate-100",
                  "leading-relaxed"
                )}
              >
                {comment.text}
              </Text>
              <View className={clsx("flex-row items-center gap-4 mt-2")}>
                <View className={clsx("flex-row items-center gap-2")}>
                  <TouchableOpacity
                    onPress={toggleLike}
                    disabled={!user || isLiking}
                    className={clsx(
                      "p-1.5 rounded-full",
                      "flex-row items-center gap-1.5",
                      "text-sm",
                      isLiked
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
                      "hover:bg-slate-100 dark:hover:bg-dark2",
                      "transition-all duration-200",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {isLiking ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <ThumbsUp size={16}
                        className={clsx("w-4 h-4", isLiked && "fill-current")}
                      />
                    )}
                    {likeCount > 0 && (
                      <Text className="text-xs font-medium">{likeCount}</Text>
                    )}
                  </TouchableOpacity>
                </View>
                {user?.id && (
                  <TouchableOpacity
                    onPress={() => setIsReplying(!isReplying)}
                    className={clsx(
                      "text-sm",
                      "text-slate-500 hover:text-slate-900",
                      "dark:text-slate-400 dark:hover:text-slate-100",
                      "transition-colors duration-200"
                    )}
                  >
                    <Text className="text-sm">Reply</Text>
                  </TouchableOpacity>
                )}
              </View>
              {isReplying && (
                <View className={clsx("flex-col gap-2", "mt-2")}>
                  <View
                    className={clsx(
                      "relative",
                      "border border-slate-200 dark:border-slate-700",
                      "rounded-lg",
                      "p-2",
                      "focus-within:ring-1 focus-within:ring-blue-500/20",
                      "focus-within:border-blue-500",
                      "transition-all duration-200"
                    )}
                  >
                    <TextInput
                        multiline={true}
                        numberOfLines={3}
                      value={replyText}
                      onChangeText={(newText) => {
                        if (newText.length <= MAX_CHARS) {
                          setReplyText(newText);
                        }
                      }}
                      className={clsx(
                        "w-full min-h-[60px]",
                        "bg-transparent",
                        "text-slate-900 dark:text-slate-100",
                        "placeholder:text-slate-500 dark:placeholder:text-slate-400",
                        "focus:outline-none",
                        "text-sm",
                        "resize-none"
                      )}
                      placeholder="Write your reply..."
                      maxLength={MAX_CHARS}
                    />
                    <View
                      className={clsx(
                        "absolute bottom-2 right-2",
                        "flex-row items-center gap-2"
                      )}
                    >
                      <Text
                        className={clsx(
                          "text-xs",
                          "text-slate-500 dark:text-slate-400",
                          replyText.length >= MAX_CHARS &&
                            "text-red-500 dark:text-red-400"
                        )}
                      >
                        {replyText.length}/{MAX_CHARS}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setIsReplying(false)}
                        className={clsx(
                          "px-3 py-1.5 rounded-md",
                          "text-sm font-medium",
                          "text-slate-600 hover:text-slate-900",
                          "dark:text-slate-400 dark:hover:text-slate-100",
                          "hover:bg-slate-100 dark:hover:bg-dark2",
                          "transition-all duration-200"
                        )}
                      >
                        <Text className="text-sm">Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleReply}
                        disabled={!replyText.trim() || isPostingReply}
                        className={clsx(
                          "px-3 py-1.5 rounded-md",
                          "text-sm font-medium",
                          "text-black dark:text-white",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "transition-all duration-200",
                          "flex-row items-center gap-1.5"
                        )}
                      >
                        {isPostingReply ? (
                          <>
                            <Loader className="w-3.5 h-3.5 animate-spin" />
                            <Text className="text-sm">Posting...</Text>
                          </>
                        ) : (
                          <>
                            <Send size={16} className="w-3.5 h-3.5" />
                            <Text className="text-sm">Post</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </View>
      {hasReplies && (
        <View className={clsx("flex-col gap-4", "mt-2")}>
          <TouchableOpacity
            onPress={() => setShowAllReplies(!showAllReplies)}
            className={clsx(
              "text-sm",
              "text-slate-500 hover:text-slate-900",
              "dark:text-slate-400 dark:hover:text-slate-100",
              "transition-colors duration-200",
              "flex-row items-center gap-1.5",
              "w-fit",
              "-mt-2 mb-1",
              "ml-14",
              "group"
            )}
          >
            <ChevronDown className="w-3.5 h-3.5" />
            <Text className="text-xs font-medium">
              {showAllReplies ? `Hide ${replies.length} replies` : `Show ${replies.length} replies`}
            </Text>
          </TouchableOpacity>
          {showAllReplies && (
            <View className={clsx("flex-col gap-8", "pt-2")}>
              {visibleReplies.map((reply) => (
                <Comment
                  key={reply.id}
                  route={route}
                  comment={reply}
                  isOwner={user?.id === reply.user_id}
                  setComments={setComments}
                  replies={[]}
                  level={level + 1}
                  postComment={postComment}
                  user={user}
                />
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
