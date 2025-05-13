import { useState } from 'react';
import { UserCircle, ThumbsUp, MessageCircle, Share2, Clock, Dumbbell } from 'lucide-react';

interface Exercise {
  name: string;
  sets: number;
  image: string;
  weight?: number;
  reps?: number;
  muscle?: string;
}

interface Comment {
  id: number;
  text: string;
  likes: number;
  replies: Comment[];
  showReplyInput: boolean;
  newReply: string;
}

interface Workout {
  id: string;
  userId?: string;
  userName?: string;
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic: boolean;
  notes?: string;
  exercises: Exercise[];
  totalSets: number;
  duration: number;
  muscleGroups?: Record<string, number>;
}

interface WorkoutPostProps {
  workout: Workout;
}

export default function WorkoutPost({ workout }: WorkoutPostProps) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCmt: Comment = {
        id: Date.now(),
        text: newComment,
        likes: 0,
        replies: [],
        showReplyInput: false,
        newReply: ''
      };
      setComments([...comments, newCmt]);
      setNewComment('');
    }
  };

  const handleLikeComment = (id: number) => {
    const updateLikes = (cmts: Comment[]): Comment[] =>
      cmts.map(c =>
        c.id === id
          ? { ...c, likes: c.likes + 1 }
          : { ...c, replies: updateLikes(c.replies) }
      );
    setComments(updateLikes(comments));
  };

  const toggleReplyInput = (id: number) => {
    const updateReplies = (cmts: Comment[]): Comment[] =>
      cmts.map(c =>
        c.id === id
          ? { ...c, showReplyInput: !c.showReplyInput }
          : { ...c, replies: updateReplies(c.replies) }
      );
    setComments(updateReplies(comments));
  };

  const handleReplyChange = (id: number, text: string) => {
    const updateText = (cmts: Comment[]): Comment[] =>
      cmts.map(c =>
        c.id === id
          ? { ...c, newReply: text }
          : { ...c, replies: updateText(c.replies) }
      );
    setComments(updateText(comments));
  };

  const handleAddReply = (id: number) => {
    const addReplyToComment = (cmts: Comment[]): Comment[] =>
      cmts.map(c => {
        if (c.id === id && c.newReply.trim()) {
          const reply: Comment = {
            id: Date.now(),
            text: c.newReply,
            likes: 0,
            replies: [],
            showReplyInput: false,
            newReply: ''
          };
          return {
            ...c,
            replies: [...c.replies, reply],
            newReply: '',
            showReplyInput: false
          };
        } else {
          return { ...c, replies: addReplyToComment(c.replies) };
        }
      });
    setComments(addReplyToComment(comments));
  };

  const renderComments = (cmts: Comment[], level = 0) => (
    <div className="text-sm text-white space-y-2">
      {cmts.map(cmt => (
        <div key={cmt.id} className="border-t pt-2 ml-[${level * 20}px]">
          <div className="flex items-start space-x-2">
            <UserCircle className="w-5 h-5 mt-1" />
            <div className="flex-1">
              <div className="font-semibold">raffat2</div> 
              <div>{cmt.text}</div>
              <div className="flex space-x-4 text-xs mt-1">
                <span
                  className="flex items-center space-x-1 cursor-pointer hover:text-blue-500"
                  onClick={() => handleLikeComment(cmt.id)}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{cmt.likes} {cmt.likes === 1 ? 'like' : 'likes'}</span>
                </span>
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => toggleReplyInput(cmt.id)}
                >
                  Reply
                </span>
              </div>
              {cmt.showReplyInput && (
                <div className="mt-2 space-y-1">
                  <input
                    value={cmt.newReply}
                    onChange={(e) => handleReplyChange(cmt.id, e.target.value)}
                    placeholder="Write a reply..."
                    className="w-full p-1 border rounded bg-black/30 text-xs"
                  />
                  <button
                    onClick={() => handleAddReply(cmt.id)}
                    className="text-xs px-2 py-1 bg-gray-700 rounded"
                  >
                    Reply
                  </button>
                </div>
              )}
              {renderComments(cmt.replies, level + 1)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 rounded-xl text-white bg-black/40 shadow space-y-3 border border-gray-700">
      <div className="flex items-center space-x-3">
        <UserCircle className="w-8 h-8" />
        <div>
          <div className="font-semibold">{workout.userName}</div>
          <div className="text-xs">{new Date(workout.date).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="text-base font-bold mt-2">{workout.title}</div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4" />
          <span>{workout.duration} min</span>
        </div>
        <div className="flex items-center space-x-2">
          <Dumbbell className="w-4 h-4" />
          <span>{workout.volume} kg</span>
        </div>
        <div className="flex items-center space-x-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{workout.totalSets} sets</span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        {workout.exercises.map((ex, i) => (
          <div key={i} className="flex items-center space-x-4 bg-zinc-800/50 p-3 rounded-lg">
            <img
              src={ex.image}
              alt={ex.name}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{ex.name}</div>
              <div className="text-xs text-gray-400">
                {ex.sets} sets
                {ex.weight && ex.reps && ` • ${ex.weight}kg × ${ex.reps} reps`}
                {ex.muscle && ` • ${ex.muscle}`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="text-sm text-gray-400 mt-2">
          <p>{workout.notes}</p>
        </div>
      )}

      <div className="flex justify-between text-white text-sm pt-2 border-t mt-3">
        <div
          className="flex items-center space-x-2 cursor-pointer hover:text-blue-500"
          onClick={() => setLikes(likes + 1)}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-4 h-4" />
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
        <Share2 className="w-4 h-4 cursor-pointer hover:text-blue-500" onClick={() => alert("Share coming soon")} />
      </div>

      <div className="space-y-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 border rounded text-sm bg-black/30"
        />
        <button
          onClick={handleAddComment}
          className="text-sm px-3 py-1 bg-blue-500 text-white rounded"
        >
          Post
        </button>

        {renderComments(comments)}
      </div>
    </div>
  );
}