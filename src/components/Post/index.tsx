import {
  Avatar,
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text,
} from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { FiHeart } from "react-icons/fi";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { UserType } from "../../types/User.interface";
import { PostType } from "../../types/post.interface";
import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { TeachersProps } from "../../types/Teachers.interface";
import { BadgeExperience } from "../BadgeExperience";
import { getTimeDifference } from "../../utils/getTimeDifference";

type PostProps = {
  post: PostType;
  deletePost: (postId: string) => void;
};

export function Post({ post, deletePost }: PostProps) {
  const { user } = useAuth();

  const isMe = post?.authorId === user?.id;
  const [teacherXp, setTeacherXp] = useState(0);
  const [teacherName, setTeacherName] = useState("");
  const [teacherAvatar, setTeacherAvatar] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(post?.likes);

  useMemo(() => {
    async function fetchUserData() {
      const teacherRef = collection(db, "teachers");
      const q = query(teacherRef, where("user_id", "==", post?.authorId));
      const teacherSnap = await getDocs(q);

      if (!teacherSnap.empty) {
        const teacherData = teacherSnap.docs[0].data() as TeachersProps;

        setTeacherXp(teacherData?.xp);
      }

      if (!isMe) {
        const userRef = doc(db, "users", post?.authorId);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() as UserType;
        setTeacherName(userData?.name);
        setTeacherAvatar(userData?.avatar);
      }
    }

    if (!user) return;

    if (post?.usersWhoLiked?.includes(user?.id)) {
      setIsLiked(true);
    }

    fetchUserData();
  }, []);

  async function handleLikePost() {
    if (!user) return;

    if (isLiked) {
      const postRef = doc(db, "posts", post?.id);
      await updateDoc(postRef, {
        usersWhoLiked: post?.usersWhoLiked?.filter((id) => id !== user?.id),
        likes: increment(-1),
      });
      setIsLiked(false);
      setPostLikes(postLikes - 1);
    } else {
      const postRef = doc(db, "posts", post?.id);
      await updateDoc(postRef, {
        usersWhoLiked: [...post?.usersWhoLiked, user?.id],
        likes: increment(1),
      });
      setIsLiked(true);
      setPostLikes(postLikes + 1);
    }
  }

  async function handleDeletePost() {
    deletePost(post?.id);
  }

  return (
    <Flex
      flexDirection="column"
      borderColor={colors?.texts.zinc100}
      borderWidth={1}
      padding="16px"
      flex="1"
      borderRadius="8px"
      mb="16px"
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap="8px">
          <Avatar
            src={isMe ? user?.avatar : teacherAvatar}
            name={isMe ? user.name : teacherName}
          />
          <Box>
            <Text>
              {isMe ? user?.name : teacherName} -{" "}
              <BadgeExperience xp={teacherXp} />
            </Text>
            <Text fontSize="12px">
              {getTimeDifference(
                new Date(post.createdAt.seconds * 1000).toDateString()
              )}
            </Text>
          </Box>
        </Flex>
        {isMe && (
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="none" bg="transparent">
                <BiDotsVerticalRounded size="24px" color={colors?.texts.base} />
              </Button>
            </PopoverTrigger>

            <PopoverContent mr="80px" width="120px">
              <PopoverArrow ml="40px" />

              <PopoverBody>
                <Flex direction="column">
                  <Button
                    colorScheme="none"
                    bg="transparent"
                    color={colors?.texts.base}
                    fontSize="14px"
                    fontWeight="normal"
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    onClick={handleDeletePost}
                  >
                    Excluir
                  </Button>
                </Flex>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </Flex>

      <Text mt="16px">{post?.content?.text}</Text>

      {postLikes > 0 && (
        <Text mt="16px">
          {postLikes} curtida{postLikes > 1 && "s"}
        </Text>
      )}

      <Flex mt="8px">
        <Button
          colorScheme="none"
          padding={0}
          margin={0}
          boxSizing="border-box"
          ml="-8px"
          onClick={handleLikePost}
        >
          <FiHeart
            fill={isLiked ? "#E33D3D" : "none"}
            color="#E33D3D"
            size="24px"
          />
        </Button>
      </Flex>
    </Flex>
  );
}
