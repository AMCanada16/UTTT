import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useState } from 'react'
import useFriends from '../../hooks/useFriends'

function UserComponent({
  user,
  onSelect,
  selected
}:{
  user: friendType
  onSelect: () => void
  selected: boolean
}) {
  return (
    <Pressable onPress={() => onSelect()}>
      <Text>{user.username}</Text>
    </Pressable>
  )
}

export default function index() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [search, setSearch] = useState<string>("")
  const [page, setPage] = useState<number>(0)
  const users = useFriends(search, false, page)

  async function deleteSelected() {

  }

  return (
    <View>
      <Text>Admin</Text>
      <FlatList
        data={users.friends}
        renderItem={(user) => (
          <UserComponent selected={selectedUsers.includes(user.item.uid)} user={user.item} onSelect={() => {
            if (selectedUsers.includes(user.item.uid)) {
              setSelectedUsers(selectedUsers.filter((x) => x !== user.item.uid))
            } else {
              setSelectedUsers([...selectedUsers, user.item.uid])
            }
          }}/>
        )}
      />
    </View>
  )
}