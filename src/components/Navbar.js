import { Burger, Drawer, List, Anchor } from '@mantine/core'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProvideAuth } from '../auth'
import {
  AiOutlineHome,
  AiOutlineBars,
  AiOutlineLogout,
} from 'react-icons/ai'

const Navbar = () => {
  const [opened, setOpened] = useState(false)
  const auth = useProvideAuth()
  const menuItems = [
    {
      name: 'Home',
      icon: <AiOutlineHome />,
      link: '/',
    },
    {
      name: 'My Listings',
      icon: <AiOutlineBars />,
      link: '/my-listings',
    },
    {
      name: 'Sign out',
      icon: <AiOutlineLogout />,
      link: '/',
      fn: () => {
        auth.logOut()
      },
    },
  ]

  return (
    <>
      <Burger opened={opened} onClick={() => setOpened((o) => !o)} />
      <Drawer
        className="navbar"
        position="right"
        opened={opened}
        onClose={() => setOpened(false)}
        padding="sm"
        size="md"
      >
        <List className="menu-list">
          {menuItems.map((menuItem) => (
            <List.Item
              key={menuItem.name}
              onClick={menuItem.fn ? () => menuItem.fn() : () => false}
            >
              <Anchor
                className="menu-list-link"
                component={Link}
                onClick={() => setOpened(false)}
                to={menuItem.link}
                color="dark"
              >
                {menuItem.icon}
                {menuItem.name}
              </Anchor>
            </List.Item>
          ))}
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
