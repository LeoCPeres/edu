import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { colors } from "../../styles/colors";
import { useEffect, useState } from "react";
import { UserType } from "../../types/User.interface";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { getTimeDifference } from "../../utils/getTimeDifference";
import { FiStar } from "react-icons/fi";

type RateCardProps = {
  rate: {
    id: string;
    rating: number;
    comment: string;
    userId: string;
    createdAt: any;
  };
};

export function RateCard({ rate }: RateCardProps) {
  const [userRated, setUserDated] = useState<UserType>();

  useEffect(() => {
    async function getUserData() {
      const userData = await getDoc(doc(db, "users", rate.userId));
      setUserDated(userData.data() as UserType);
    }

    getUserData();
  }, []);

  return (
    <Flex
      borderColor={colors?.gray100}
      borderWidth="1px"
      bg="#FFF"
      paddingX="24px"
      py="16px"
      flexDir="column"
      borderRadius="8px"
    >
      <Flex>
        <Flex gap="16px" alignItems="center">
          <Avatar src={userRated?.avatar} name={userRated?.name} />
          <Flex flexDir="column">
            <Text fontWeight="semibold">{userRated?.name}</Text>
            <Text fontSize="12px" mt="-4px">
              {getTimeDifference(
                new Date(rate.createdAt.seconds * 1000).toDateString()
              )}
            </Text>
          </Flex>
          {[0, 1, 2, 3, 4].map((star) => {
            return (
              <FiStar
                key={star}
                width="20px"
                height="20px"
                color={star < rate.rating ? "#F3D500" : colors?.gray100}
                fill={star < rate.rating ? "#F3D500" : colors?.gray100}
              />
            );
          })}
        </Flex>
      </Flex>

      <Text fontSize="14px" mt="8px">
        {rate.comment}
      </Text>
    </Flex>
  );
}
