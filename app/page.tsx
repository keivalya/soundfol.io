"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Search,
  Instagram,
  Youtube,
  Mail,
  Moon,
  Sun,
  Palette,
  Edit,
  Plus,
  Trash2,
  Move,
  Maximize,
  Minimize,
  X,
  Save,
  ExternalLink,
  LogOut,
  Music,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import Cookies from "js-cookie"

// Define types for our data structures
type SocialLink = {
  id: string
  platform: string
  url: string
  icon: React.ReactNode
}

type ProjectItem = {
  id: string
  title: string
  image: string
  url: string
  type: "spotify" | "soundcloud" | "youtube" | "custom"
}

type BentoBox = {
  id: string
  title: string
  type: "text" | "image" | "gallery" | "embed" | "experience" | "education" | "projects"
  content: any
  size: "small" | "medium" | "large"
  colSpan: number
  rowSpan: number
}

type PortfolioSection = {
  id: string
  title: string
  boxes: BentoBox[]
}

type UserData = {
  profileData: {
    username: string
    name: string
    location: string
    bio: string
    profileImage: string
  }
  socialLinks: SocialLink[]
  portfolioSections: PortfolioSection[]
  theme: {
    isDarkMode: boolean
    isInverted: boolean
    profileColor: string
  }
  projects: ProjectItem[]
}

// Function to extract Spotify album ID from URL
const extractSpotifyAlbumId = (url: string): string | null => {
  const regex = /album\/([a-zA-Z0-9]+)/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Function to get album cover from Spotify album ID
const getSpotifyAlbumCover = async (albumId: string): Promise<string> => {
  try {
    // In a real app, you would use the Spotify API to fetch album details
    // For this demo, we'll return a placeholder image
    return `/placeholder.svg?height=300&width=300&text=Album+${albumId}`
  } catch (error) {
    console.error("Error fetching Spotify album cover:", error)
    return "/placeholder.svg?height=300&width=300&text=Album+Cover"
  }
}

export default function MusicianPortfolio() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading, logout, updateUserProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInverted, setIsInverted] = useState(false)
  const [profileColor, setProfileColor] = useState("#5BB9DB")
  const [isEditMode, setIsEditMode] = useState(false)
  const [isLayoutMode, setIsLayoutMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // User profile data
  const [profileData, setProfileData] = useState({
    username: "@avanti",
    name: "Avanti Singh",
    location: "Boston, MA",
    bio: "Music Producer | Singer | Audio Programmer | Video | Game Sound Design",
    // profileImage: "/placeholder.svg?height=144&width=144",
    profileImage: "https://avantisingh.io/wp-content/uploads/2024/12/home-img-2.webp",
  })

  // Projects data
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "1",
      title: "Summer Vibes EP",
      image: "/placeholder.svg?height=300&width=300&text=Summer+Vibes",
      url: "https://open.spotify.com/album/1DFixLWuPkv3KT3TnV35m3",
      type: "spotify",
    },
    {
      id: "2",
      title: "Acoustic Sessions",
      image: "/placeholder.svg?height=300&width=300&text=Acoustic+Sessions",
      url: "https://open.spotify.com/album/2noRn2Aes5aoNVsU6iWThc",
      type: "spotify",
    },
  ])

  // New project data
  const [newProject, setNewProject] = useState({
    title: "",
    url: "",
    type: "spotify" as "spotify" | "soundcloud" | "youtube" | "custom",
    image: "",
  })

  // Editing project
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null)

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { id: "1", platform: "Instagram", url: "https://instagram.com", icon: <Instagram className="h-6 w-6" /> },
    { id: "2", platform: "YouTube", url: "https://youtube.com", icon: <Youtube className="h-6 w-6" /> },
    { id: "3", platform: "Email", url: "mailto:adam@example.com", icon: <Mail className="h-6 w-6" /> },
  ])

  // Portfolio sections
  const [portfolioSections, setPortfolioSections] = useState<PortfolioSection[]>([
    {
      id: "portfolio",
      title: "Portfolio",
      boxes: [
        {
          id: "projects",
          title: "Projects",
          type: "projects",
          content: "projects",
          size: "large",
          colSpan: 3,
          rowSpan: 1,
        },
        {
          id: "performances",
          title: "Performances / Press",
          type: "text",
          content: "Add your performances and press mentions here.",
          size: "large",
          colSpan: 2,
          rowSpan: 1,
        },
        {
          id: "music",
          title: "Music",
          type: "embed",
          content: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator",
          size: "medium",
          colSpan: 2,
          rowSpan: 1,
        },
        {
          id: "demo",
          title: "Demo Reel",
          type: "text",
          content: "Add your demo reel here.",
          size: "large",
          colSpan: 3,
          rowSpan: 1,
        },
      ],
    },
    {
      id: "about",
      title: "About",
      boxes: [
        {
          id: "bio",
          title: "Bio",
          type: "text",
          content:
            "Adam is a versatile musician based in Boston, MA with expertise in music production, singing, audio programming, and game sound design. With a passion for creating immersive audio experiences, Adam has worked on various projects ranging from indie games to commercial productions.",
          size: "medium",
          colSpan: 1,
          rowSpan: 1,
        },
        {
          id: "experience",
          title: "Work Experience",
          type: "experience",
          content: [
            {
              id: "exp1",
              title: "Senior Sound Designer",
              company: "GameSound Studios",
              period: "2020-Present",
              description: "Created immersive audio experiences for AAA game titles.",
            },
            {
              id: "exp2",
              title: "Music Producer",
              company: "Indie Records",
              period: "2018-2020",
              description: "Produced albums for emerging artists across multiple genres.",
            },
          ],
          size: "medium",
          colSpan: 1,
          rowSpan: 1,
        },
        {
          id: "education",
          title: "Education",
          type: "education",
          content: [
            {
              id: "edu1",
              institution: "Berklee College of Music",
              degree: "Bachelor of Music",
              period: "2014-2018",
              description: "Major in Electronic Production and Sound Design",
            },
            {
              id: "edu2",
              institution: "Audio Engineering Society",
              degree: "Audio Programming Certification",
              period: "2019",
              description: "Advanced techniques in audio programming and DSP",
            },
          ],
          size: "medium",
          colSpan: 1,
          rowSpan: 1,
        },
      ],
    },
  ])

  // New box form data
  const [newBoxData, setNewBoxData] = useState({
    title: "",
    type: "text",
    size: "medium",
    section: "portfolio",
  })

  // Edit box data
  const [editingBox, setEditingBox] = useState<BentoBox | null>(null)
  const [editingSectionId, setEditingSectionId] = useState<string>("")

  // Edit profile data
  const [editingProfile, setEditingProfile] = useState(false)
  const [editProfileData, setEditProfileData] = useState({ ...profileData })

  // Edit social link data
  const [editingSocialLink, setEditingSocialLink] = useState<SocialLink | null>(null)
  const [newSocialLink, setNewSocialLink] = useState({
    platform: "Instagram",
    url: "",
  })

  const colorOptions = [
    { name: "Blue", value: "#5BB9DB" },
    { name: "Green", value: "#4FAA52" },
    { name: "Purple", value: "#8A2BE2" },
    { name: "Black", value: "#000000" },
    { name: "Light Blue", value: "#B8E2F2" },
    { name: "White", value: "#FFFFFF" },
  ]

  // Check if user is authenticated and load saved data
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user) {
      // Load user data
      if (user.name) setProfileData((prev) => ({ ...prev, name: user.name }))
      if (user.username) setProfileData((prev) => ({ ...prev, username: user.username }))
      if (user.location) setProfileData((prev) => ({ ...prev, location: user.location }))
      if (user.bio) setProfileData((prev) => ({ ...prev, bio: user.bio }))
      if (user.profileImage) setProfileData((prev) => ({ ...prev, profileImage: user.profileImage }))

      // Load theme settings from cookies
      const themeCookie = Cookies.get(`soundfolio_theme_${user.id}`)
      if (themeCookie) {
        try {
          const themeData = JSON.parse(themeCookie)
          setIsDarkMode(themeData.isDarkMode)
          setIsInverted(themeData.isInverted)
          setProfileColor(themeData.profileColor)
        } catch (error) {
          console.error("Error loading theme from cookies:", error)
        }
      }

      // Load saved portfolio data from localStorage if available
      const savedData = localStorage.getItem(`soundfolio_data_${user.id}`)
      if (savedData) {
        try {
          const parsedData: UserData = JSON.parse(savedData)

          setProfileData(parsedData.profileData)
          setSocialLinks(parsedData.socialLinks)
          setPortfolioSections(parsedData.portfolioSections)
          if (parsedData.projects) setProjects(parsedData.projects)

          // Only set theme if not already loaded from cookies
          if (!themeCookie) {
            setIsDarkMode(parsedData.theme.isDarkMode)
            setIsInverted(parsedData.theme.isInverted)
            setProfileColor(parsedData.theme.profileColor)
          }
        } catch (error) {
          console.error("Error loading saved data:", error)
        }
      }

      // Load layout settings from cookies
      const layoutCookie = Cookies.get(`soundfolio_layout_${user.id}`)
      if (layoutCookie) {
        try {
          const layoutData = JSON.parse(layoutCookie)
          setPortfolioSections(layoutData)
        } catch (error) {
          console.error("Error loading layout from cookies:", error)
        }
      }
    }
  }, [isLoading, user, router])

  // Set unsaved changes flag when data changes
  useEffect(() => {
    if (user) {
      setHasUnsavedChanges(true)
    }
  }, [profileData, socialLinks, portfolioSections, isDarkMode, isInverted, profileColor, projects, user])

  // Save theme settings to cookies when they change
  useEffect(() => {
    if (user) {
      const themeData = {
        isDarkMode,
        isInverted,
        profileColor,
      }
      Cookies.set(`soundfolio_theme_${user.id}`, JSON.stringify(themeData), { expires: 365 })
    }
  }, [isDarkMode, isInverted, profileColor, user])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const toggleInverted = () => setIsInverted(!isInverted)

  const toggleEditMode = () => {
    if (isEditMode && isLayoutMode) {
      // If we're in layout mode, exit layout mode first
      setIsLayoutMode(false)
    } else {
      // Toggle edit mode
      setIsEditMode(!isEditMode)
    }
  }

  const toggleLayoutMode = () => {
    if (!isEditMode) {
      // Can't enter layout mode without being in edit mode
      setIsEditMode(true)
    }
    setIsLayoutMode(!isLayoutMode)
  }

  // Dynamic styles based on theme settings
  const bgColor = isDarkMode ? "bg-gray-900" : isInverted ? "bg-white" : "bg-[#B8E2F2]/30"
  const boxBgColor = isDarkMode ? "bg-gray-800" : isInverted ? "bg-white" : "bg-white"
  const textColor = isDarkMode ? "text-white" : "text-gray-900"
  const buttonTextColor = isDarkMode ? "text-gray-900" : "text-white"

  // Handle profile image upload
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setEditProfileData({
        ...editProfileData,
        profileImage: imageUrl,
      })
    }
  }

  // Handle project image upload
  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      if (editingProject) {
        setEditingProject({
          ...editingProject,
          image: imageUrl,
        })
      } else {
        setNewProject({
          ...newProject,
          image: imageUrl,
        })
      }
    }
  }

  // Save profile data
  const saveProfileData = () => {
    setProfileData(editProfileData)
    setEditingProfile(false)
    setHasUnsavedChanges(true)
  }

  // Add new project
  const addNewProject = async () => {
    if (!newProject.title || !newProject.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    let projectImage = newProject.image

    // If it's a Spotify album and no custom image is provided, try to get the album cover
    if (newProject.type === "spotify" && !projectImage) {
      const albumId = extractSpotifyAlbumId(newProject.url)
      if (albumId) {
        projectImage = await getSpotifyAlbumCover(albumId)
      } else {
        projectImage = "/placeholder.svg?height=300&width=300&text=Album+Cover"
      }
    } else if (!projectImage) {
      // Default image if none provided
      projectImage = "/placeholder.svg?height=300&width=300&text=Project"
    }

    const newProjectItem: ProjectItem = {
      id: Date.now().toString(),
      title: newProject.title,
      image: projectImage,
      url: newProject.url,
      type: newProject.type,
    }

    setProjects([...projects, newProjectItem])
    setNewProject({
      title: "",
      url: "",
      type: "spotify",
      image: "",
    })
    setHasUnsavedChanges(true)
  }

  // Update project
  const updateProject = async () => {
    if (!editingProject) return

    if (!editingProject.title || !editingProject.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    let projectImage = editingProject.image

    // If it's a Spotify album and image is the default, try to get the album cover
    if (editingProject.type === "spotify" && (!projectImage || projectImage.includes("/placeholder.svg"))) {
      const albumId = extractSpotifyAlbumId(editingProject.url)
      if (albumId) {
        projectImage = await getSpotifyAlbumCover(albumId)
      }
    }

    const updatedProjects = projects.map((project) =>
      project.id === editingProject.id ? { ...editingProject, image: projectImage } : project,
    )

    setProjects(updatedProjects)
    setEditingProject(null)
    setHasUnsavedChanges(true)
  }

  // Delete project
  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id))
    setHasUnsavedChanges(true)
  }

  // Add new social link
  const addSocialLink = () => {
    const icon =
      newSocialLink.platform === "Instagram" ? (
        <Instagram className="h-6 w-6" />
      ) : newSocialLink.platform === "YouTube" ? (
        <Youtube className="h-6 w-6" />
      ) : newSocialLink.platform === "Email" ? (
        <Mail className="h-6 w-6" />
      ) : (
        <ExternalLink className="h-6 w-6" />
      )

    const newLink: SocialLink = {
      id: Date.now().toString(),
      platform: newSocialLink.platform,
      url: newSocialLink.url,
      icon,
    }

    setSocialLinks([...socialLinks, newLink])
    setNewSocialLink({
      platform: "Instagram",
      url: "",
    })
    setHasUnsavedChanges(true)
  }

  // Update social link
  const updateSocialLink = () => {
    if (!editingSocialLink) return

    const icon =
      editingSocialLink.platform === "Instagram" ? (
        <Instagram className="h-6 w-6" />
      ) : editingSocialLink.platform === "YouTube" ? (
        <Youtube className="h-6 w-6" />
      ) : editingSocialLink.platform === "Email" ? (
        <Mail className="h-6 w-6" />
      ) : (
        <ExternalLink className="h-6 w-6" />
      )

    const updatedLinks = socialLinks.map((link) =>
      link.id === editingSocialLink.id ? { ...editingSocialLink, icon } : link,
    )

    setSocialLinks(updatedLinks)
    setEditingSocialLink(null)
    setHasUnsavedChanges(true)
  }

  // Delete social link
  const deleteSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id))
    setHasUnsavedChanges(true)
  }

  // Add new box
  const addNewBox = () => {
    const newBox: BentoBox = {
      id: Date.now().toString(),
      title: newBoxData.title,
      type: newBoxData.type as any,
      content:
        newBoxData.type === "gallery"
          ? []
          : newBoxData.type === "experience"
            ? []
            : newBoxData.type === "education"
              ? []
              : newBoxData.type === "projects"
                ? "projects"
                : "",
      size: newBoxData.size as any,
      colSpan: newBoxData.size === "small" ? 1 : newBoxData.size === "medium" ? 1 : 2,
      rowSpan: 1,
    }

    const updatedSections = portfolioSections.map((section) => {
      if (section.id === newBoxData.section) {
        return {
          ...section,
          boxes: [...section.boxes, newBox],
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setNewBoxData({
      title: "",
      type: "text",
      size: "medium",
      section: "portfolio",
    })
    setHasUnsavedChanges(true)
  }

  // Update box
  const updateBox = () => {
    if (!editingBox || !editingSectionId) return

    const updatedSections = portfolioSections.map((section) => {
      if (section.id === editingSectionId) {
        return {
          ...section,
          boxes: section.boxes.map((box) => (box.id === editingBox.id ? editingBox : box)),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setEditingBox(null)
    setEditingSectionId("")
    setHasUnsavedChanges(true)
  }

  // Delete box
  const deleteBox = (sectionId: string, boxId: string) => {
    const updatedSections = portfolioSections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          boxes: section.boxes.filter((box) => box.id !== boxId),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)
  }

  // Handle box size change
  const changeBoxSize = (sectionId: string, boxId: string, newSize: "small" | "medium" | "large") => {
    const updatedSections = portfolioSections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          boxes: section.boxes.map((box) => {
            if (box.id === boxId) {
              return {
                ...box,
                size: newSize,
                colSpan: newSize === "small" ? 1 : newSize === "medium" ? 1 : 2,
              }
            }
            return box
          }),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)
  }

  // Handle drag and drop
  const handleDragEnd = (result: any, sectionId: string) => {
    if (!result.destination) return

    const section = portfolioSections.find((s) => s.id === sectionId)
    if (!section) return

    const items = Array.from(section.boxes)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedSections = portfolioSections.map((s) => {
      if (s.id === sectionId) {
        return {
          ...s,
          boxes: items,
        }
      }
      return s
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)

    // Save layout to cookies
    if (user) {
      Cookies.set(`soundfolio_layout_${user.id}`, JSON.stringify(updatedSections), { expires: 365 })
    }
  }

  // Add content to gallery
  const addGalleryItem = (sectionId: string, boxId: string) => {
    const updatedSections = portfolioSections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          boxes: section.boxes.map((box) => {
            if (box.id === boxId && box.type === "gallery") {
              return {
                ...box,
                content: [
                  ...box.content,
                  {
                    id: Date.now().toString(),
                    image: "/placeholder.svg?height=200&width=200",
                    title: `Item ${box.content.length + 1}`,
                  },
                ],
              }
            }
            return box
          }),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)
  }

  // Add experience item
  const addExperienceItem = (sectionId: string, boxId: string) => {
    const updatedSections = portfolioSections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          boxes: section.boxes.map((box) => {
            if (box.id === boxId && box.type === "experience") {
              return {
                ...box,
                content: [
                  ...box.content,
                  {
                    id: Date.now().toString(),
                    title: "New Position",
                    company: "Company Name",
                    period: "Year-Year",
                    description: "Description of your role",
                  },
                ],
              }
            }
            return box
          }),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)
  }

  // Add education item
  const addEducationItem = (sectionId: string, boxId: string) => {
    const updatedSections = portfolioSections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          boxes: section.boxes.map((box) => {
            if (box.id === boxId && box.type === "education") {
              return {
                ...box,
                content: [
                  ...box.content,
                  {
                    id: Date.now().toString(),
                    institution: "Institution Name",
                    degree: "Degree Name",
                    period: "Year-Year",
                    description: "Description of your studies",
                  },
                ],
              }
            }
            return box
          }),
        }
      }
      return section
    })

    setPortfolioSections(updatedSections)
    setHasUnsavedChanges(true)
  }

  // Save all changes
  const saveChanges = async () => {
    if (!user) return

    setIsSaving(true)

    try {
      // Update user profile in auth context
      await updateUserProfile({
        name: profileData.name,
        username: profileData.username,
        location: profileData.location,
        bio: profileData.bio,
        profileImage: profileData.profileImage,
      })

      // Save all portfolio data to localStorage
      const userData: UserData = {
        profileData,
        socialLinks,
        portfolioSections,
        theme: {
          isDarkMode,
          isInverted,
          profileColor,
        },
        projects,
      }

      localStorage.setItem(`soundfolio_data_${user.id}`, JSON.stringify(userData))

      // Save layout to cookies
      Cookies.set(`soundfolio_layout_${user.id}`, JSON.stringify(portfolioSections), { expires: 365 })

      // Save theme to cookies
      Cookies.set(
        `soundfolio_theme_${user.id}`,
        JSON.stringify({
          isDarkMode,
          isInverted,
          profileColor,
        }),
        { expires: 365 },
      )

      setHasUnsavedChanges(false)

      toast({
        title: "Success",
        description: "Your changes have been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Loading...</h2>
          <p className="text-gray-500">Please wait while we load your portfolio</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-300`}
      style={{ backgroundColor: !isDarkMode && !isInverted ? `${profileColor}10` : "" }}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between p-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"} border-b`}
        style={{ borderColor: isDarkMode ? "" : profileColor }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Black%20Beige%20Bold%20Framed%20Typography%20Planet%20Brand%20Business%20Logo%20%282%29-zoY2Hauf8qicWFSzCU9a6KVaFwmtan.png"
            alt="Soundfolio Logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <span className="text-2xl font-bold">Soundfolio</span>
        </Link>

        <div className="relative w-full max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className={`pl-10 pr-4 py-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white/80 border-gray-200"} backdrop-blur-sm border rounded-full`}
            placeholder="Search..."
          />
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 text-lg font-medium">
            <Link href="/explore">Explore</Link>
            <Link href="/feed">Feed</Link>
            <Link href="/jobs">Jobs</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleInverted} className="rounded-full">
              <Palette className="h-5 w-5" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={`rounded-full flex items-center gap-2 ${isDarkMode ? "text-white bg-gray-800 hover:bg-gray-700" : ""}`}
                >
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: profileColor }}></div>
                  Theme
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="grid gap-4">
                  <h4 className="font-medium">Profile Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        className={`w-8 h-8 rounded-full transition-all ${profileColor === color.value ? "ring-2 ring-black dark:ring-white ring-offset-2" : "hover:scale-110"}`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => setProfileColor(color.value)}
                        aria-label={`Set theme to ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveChanges}
                  disabled={isSaving}
                  className={`rounded-full ${isDarkMode ? "text-white bg-gray-800 hover:bg-gray-700" : ""}`}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              )}

              {isEditMode ? (
                <Button variant="default" size="sm" onClick={toggleEditMode} className="rounded-full">
                  <Edit className="h-4 w-4 mr-2" />
                  Done
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleEditMode}
                  className={`rounded-full ${isDarkMode ? "text-white bg-gray-800 hover:bg-gray-700" : ""}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}

              {isEditMode && !isLayoutMode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleLayoutMode}
                  className={`rounded-full ${isDarkMode ? "text-white bg-gray-800 hover:bg-gray-700" : ""}`}
                >
                  <Move className="h-4 w-4 mr-2" />
                  Layout
                </Button>
              )}

              {isEditMode && isLayoutMode && (
                <Button variant="default" size="sm" onClick={toggleLayoutMode} className="rounded-full">
                  <Move className="h-4 w-4 mr-2" />
                  Done
                </Button>
              )}

              <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row p-4 gap-6">
        {/* Sidebar */}
        <aside
          className={`w-full md:w-80 ${boxBgColor} rounded-3xl shadow-lg p-6 flex flex-col items-center h-fit transition-colors duration-300 relative`}
          style={{ backgroundColor: isInverted ? `${profileColor}30` : "" }}
        >
          {isEditMode && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 rounded-full"
              onClick={() => setEditingProfile(true)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}

          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-medium">{profileData.username}</span>
            <div
              className={`w-8 h-8 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center`}
            >
              <Mail className="h-4 w-4" />
            </div>
          </div>

          <div className="relative w-36 h-36 mb-4">
            <Image
              src={profileData.profileImage || "/placeholder.svg"}
              alt={profileData.name}
              width={144}
              height={144}
              className="rounded-full object-cover border-4 border-white"
              style={{ borderColor: isDarkMode ? "white" : profileColor }}
            />
          </div>

          <h2 className="text-xl font-bold mb-1">{profileData.name}</h2>
          <div className="text-center text-sm mb-4">
            {profileData.bio.split("|").map((line, index) => (
              <p key={index}>{line.trim()}</p>
            ))}
          </div>

          <div className="flex items-center gap-1 mb-6 text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
            {profileData.location}
          </div>

          <Button
            className="w-full mb-auto hover:bg-gray-800 dark:hover:bg-gray-200 rounded-full"
            style={{
              backgroundColor: isDarkMode ? "#FFFFFF" : profileColor,
              color: isDarkMode ? "#000000" : "#FFFFFF",
            }}
          >
            Resonate
          </Button>

          <div className="flex justify-center gap-6 mt-8 flex-wrap">
            {socialLinks.map((link) => (
              <div key={link.id} className="relative">
                {isEditMode && (
                  <div className="absolute -top-2 -right-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-white"
                      onClick={() => setEditingSocialLink(link)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 rounded-full bg-white"
                      onClick={() => deleteSocialLink(link.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <Link href={link.url} aria-label={link.platform} target="_blank">
                  {link.icon}
                </Link>
              </div>
            ))}

            {isEditMode && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Social Link</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select
                        value={newSocialLink.platform}
                        onValueChange={(value) => setNewSocialLink({ ...newSocialLink, platform: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="YouTube">YouTube</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={newSocialLink.url}
                        onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                        placeholder={newSocialLink.platform === "Email" ? "mailto:your@email.com" : "https://"}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={addSocialLink}>Add Link</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Tabs defaultValue="portfolio" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto pb-2 mb-6">
              <TabsTrigger
                value="portfolio"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:rounded-none data-[state=active]:shadow-none bg-transparent hover:bg-transparent"
                style={{ borderColor: isDarkMode ? "" : profileColor }}
              >
                Portfolio
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="data-[state=active]:border-b-2 data-[state=active]:border-black dark:data-[state=active]:border-white data-[state=active]:rounded-none data-[state=active]:shadow-none bg-transparent hover:bg-transparent"
                style={{ borderColor: isDarkMode ? "" : profileColor }}
              >
                About
              </TabsTrigger>

              {isEditMode && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto rounded-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Section</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="new-section-title">Section Title</Label>
                        <Input id="new-section-title" placeholder="Enter section title" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-section-id">Section ID</Label>
                        <Input id="new-section-id" placeholder="Enter section ID (lowercase, no spaces)" />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button>Add Section</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </TabsList>

            {portfolioSections.map((section) => (
              <TabsContent key={section.id} value={section.id} className="mt-0">
                {isEditMode && !isLayoutMode && (
                  <div className="mb-4 flex justify-end gap-2">
                    {section.id === "portfolio" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="rounded-full">
                            <Music className="h-4 w-4 mr-2" />
                            Add Project
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Project</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="project-title">Title</Label>
                              <Input
                                id="project-title"
                                value={newProject.title}
                                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                placeholder="Enter project title"
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="project-type">Project Type</Label>
                              <Select
                                value={newProject.type}
                                onChange={(value: any) => setNewProject({ ...newProject, type: value })}
                              >
                                <SelectTrigger id="project-type">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="spotify">Spotify Album</SelectItem>
                                  <SelectItem value="soundcloud">SoundCloud</SelectItem>
                                  <SelectItem value="youtube">YouTube</SelectItem>
                                  <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="project-url">URL</Label>
                              <Input
                                id="project-url"
                                value={newProject.url}
                                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                                placeholder={
                                  newProject.type === "spotify" ? "https://open.spotify.com/album/..." : "https://..."
                                }
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="project-image">Custom Image (Optional)</Label>
                              <div className="flex items-center gap-2">
                                {newProject.image && (
                                  <div className="relative w-16 h-16">
                                    <Image
                                      src={newProject.image || "/placeholder.svg"}
                                      alt="Project preview"
                                      width={64}
                                      height={64}
                                      className="rounded-md object-cover"
                                    />
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => document.getElementById("project-image-upload")?.click()}
                                >
                                  Upload Image
                                </Button>
                                <input
                                  id="project-image-upload"
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleProjectImageUpload}
                                />
                              </div>
                              <p className="text-sm text-gray-500">
                                {newProject.type === "spotify"
                                  ? "For Spotify albums, cover art will be automatically fetched if no custom image is provided."
                                  : "Upload a custom image for your project."}
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={addNewProject}>Add Project</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Box
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Box</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="box-title">Title</Label>
                            <Input
                              id="box-title"
                              value={newBoxData.title}
                              onChange={(e) => setNewBoxData({ ...newBoxData, title: e.target.value })}
                              placeholder="Enter box title"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="box-type">Content Type</Label>
                            <Select
                              value={newBoxData.type}
                              onChange={(value) => setNewBoxData({ ...newBoxData, type: value })}
                            >
                              <SelectTrigger id="box-type">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="gallery">Gallery</SelectItem>
                                <SelectItem value="embed">Embed</SelectItem>
                                <SelectItem value="experience">Experience</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="projects">Projects</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="box-size">Size</Label>
                            <Select
                              value={newBoxData.size}
                              onChange={(value) => setNewBoxData({ ...newBoxData, size: value })}
                            >
                              <SelectTrigger id="box-size">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="box-section">Section</Label>
                            <Select
                              value={newBoxData.section}
                              onChange={(value) => setNewBoxData({ ...newBoxData, section: value })}
                            >
                              <SelectTrigger id="box-section">
                                <SelectValue placeholder="Select section" />
                              </SelectTrigger>
                              <SelectContent>
                                {portfolioSections.map((s) => (
                                  <SelectItem key={s.id} value={s.id}>
                                    {s.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={addNewBox}>Add Box</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {isLayoutMode ? (
                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, section.id)}>
                    <Droppable droppableId={section.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                        >
                          {section.boxes.map((box, index) => (
                            <Draggable key={box.id} draggableId={box.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`${boxBgColor} rounded-3xl shadow-lg p-4 transition-colors duration-300 relative lg:col-span-${box.colSpan}`}
                                  style={{
                                    ...provided.draggableProps.style,
                                    backgroundColor: isInverted ? `${profileColor}30` : "",
                                  }}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-medium">{box.title}</h3>
                                    <div className="flex items-center gap-1">
                                      <div {...provided.dragHandleProps}>
                                        <Move className="h-4 w-4 cursor-move" />
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          changeBoxSize(
                                            section.id,
                                            box.id,
                                            box.size === "small" ? "medium" : box.size === "medium" ? "large" : "small",
                                          )
                                        }
                                      >
                                        {box.size === "large" ? (
                                          <Minimize className="h-4 w-4" />
                                        ) : (
                                          <Maximize className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-red-500"
                                        onClick={() => deleteBox(section.id, box.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Size: {box.size} | Type: {box.type}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {section.boxes.map((box) => (
                      <div
                        key={box.id}
                        className={`${boxBgColor} rounded-3xl shadow-lg p-6 transition-colors duration-300 relative lg:col-span-${box.colSpan}`}
                        style={{ backgroundColor: isInverted ? `${profileColor}30` : "" }}
                      >
                        {isEditMode && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full bg-white/80"
                              onClick={() => {
                                setEditingBox(box)
                                setEditingSectionId(section.id)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        )}

                        <h3 className="text-xl font-bold mb-4">{box.title}</h3>

                        {box.type === "text" && <p>{box.content}</p>}

                        {box.type === "gallery" && (
                          <div className="grid grid-cols-2 gap-4">
                            {box.content.map((item: any) => (
                              <div key={item.id} className="aspect-square rounded-2xl overflow-hidden">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  width={200}
                                  height={200}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {isEditMode && (
                              <Button
                                variant="outline"
                                className="aspect-square rounded-2xl flex items-center justify-center"
                                onClick={() => addGalleryItem(section.id, box.id)}
                              >
                                <Plus className="h-6 w-6" />
                              </Button>
                            )}
                          </div>
                        )}

                        {box.type === "projects" && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {projects.map((project) => (
                              <div key={project.id} className="relative group">
                                {isEditMode && (
                                  <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full bg-white/80"
                                      onClick={() => setEditingProject(project)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 rounded-full bg-white/80 text-red-500"
                                      onClick={() => deleteProject(project.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                                <Link
                                  href={project.url}
                                  target="_blank"
                                  className="block aspect-square rounded-2xl overflow-hidden relative group"
                                >
                                  <Image
                                    src={project.image || "/placeholder.svg"}
                                    alt={project.title}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="text-white text-center p-4">
                                      <h4 className="font-bold">{project.title}</h4>
                                      <div className="mt-2 flex justify-center">
                                        {project.type === "spotify" && <Music className="h-5 w-5" />}
                                        {project.type === "youtube" && <Youtube className="h-5 w-5" />}
                                        {project.type === "custom" && <ExternalLink className="h-5 w-5" />}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                                <h4 className="mt-2 font-medium text-sm truncate">{project.title}</h4>
                              </div>
                            ))}
                            {isEditMode && (
                              <Button
                                variant="outline"
                                className="aspect-square rounded-2xl flex flex-col items-center justify-center gap-2"
                                onClick={() => document.getElementById("add-project-trigger")?.click()}
                              >
                                <Plus className="h-6 w-6" />
                                <span className="text-sm">Add Project</span>
                              </Button>
                            )}
                          </div>
                        )}

                        {box.type === "embed" && (
                          <div className="overflow-hidden rounded-2xl">
                            <iframe
                              src={box.content}
                              width="100%"
                              height="352"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                              className="rounded-2xl"
                            ></iframe>
                          </div>
                        )}

                        {box.type === "experience" && (
                          <div className="space-y-4">
                            {box.content.map((item: any) => (
                              <div key={item.id}>
                                <h4 className="font-semibold">{item.title}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.company} • {item.period}
                                </p>
                                <p className="mt-1">{item.description}</p>
                              </div>
                            ))}
                            {isEditMode && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => addExperienceItem(section.id, box.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Experience
                              </Button>
                            )}
                          </div>
                        )}

                        {box.type === "education" && (
                          <div className="space-y-4">
                            {box.content.map((item: any) => (
                              <div key={item.id}>
                                <h4 className="font-semibold">{item.institution}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {item.degree} • {item.period}
                                </p>
                                <p className="mt-1">{item.description}</p>
                              </div>
                            ))}
                            {isEditMode && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => addEducationItem(section.id, box.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Education
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={editProfileData.profileImage || "/placeholder.svg"}
                  alt={editProfileData.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editProfileData.username}
                onChange={(e) => setEditProfileData({ ...editProfileData, username: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editProfileData.name}
                onChange={(e) => setEditProfileData({ ...editProfileData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editProfileData.location}
                onChange={(e) => setEditProfileData({ ...editProfileData, location: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio (use | for line breaks)</Label>
              <Textarea
                id="bio"
                value={editProfileData.bio}
                onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={saveProfileData}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Social Link Dialog */}
      <Dialog open={!!editingSocialLink} onOpenChange={(open) => !open && setEditingSocialLink(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Social Link</DialogTitle>
          </DialogHeader>
          {editingSocialLink && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-platform">Platform</Label>
                <Select
                  value={editingSocialLink.platform}
                  onValueChange={(value) => setEditingSocialLink({ ...editingSocialLink, platform: value })}
                >
                  <SelectTrigger id="edit-platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">URL</Label>
                <Input
                  id="edit-url"
                  value={editingSocialLink.url}
                  onChange={(e) => setEditingSocialLink({ ...editingSocialLink, url: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateSocialLink}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Box Content Dialog */}
      <Dialog open={!!editingBox} onOpenChange={(open) => !open && setEditingBox(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit {editingBox?.title}</DialogTitle>
          </DialogHeader>
          {editingBox && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-box-title">Title</Label>
                <Input
                  id="edit-box-title"
                  value={editingBox.title}
                  onChange={(e) => setEditingBox({ ...editingBox, title: e.target.value })}
                />
              </div>

              {editingBox.type === "text" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-box-content">Content</Label>
                  <Textarea
                    id="edit-box-content"
                    value={editingBox.content}
                    onChange={(e) => setEditingBox({ ...editingBox, content: e.target.value })}
                    className="min-h-[200px]"
                  />
                </div>
              )}

              {editingBox.type === "embed" && (
                <div className="grid gap-2">
                  <Label htmlFor="edit-box-embed">Embed URL</Label>
                  <Input
                    id="edit-box-embed"
                    value={editingBox.content}
                    onChange={(e) => setEditingBox({ ...editingBox, content: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="edit-box-size">Size</Label>
                <Select
                  value={editingBox.size}
                  onValueChange={(value) =>
                    setEditingBox({
                      ...editingBox,
                      size: value as any,
                      colSpan: value === "small" ? 1 : value === "medium" ? 1 : 2,
                    })
                  }
                >
                  <SelectTrigger id="edit-box-size">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateBox}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={!!editingProject} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-project-title">Title</Label>
                <Input
                  id="edit-project-title"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-project-type">Project Type</Label>
                <Select
                  value={editingProject.type}
                  onValueChange={(value: any) => setEditingProject({ ...editingProject, type: value })}
                >
                  <SelectTrigger id="edit-project-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spotify">Spotify Album</SelectItem>
                    <SelectItem value="soundcloud">SoundCloud</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-project-url">URL</Label>
                <Input
                  id="edit-project-url"
                  value={editingProject.url}
                  onChange={(e) => setEditingProject({ ...editingProject, url: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-project-image">Image</Label>
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-16">
                    <Image
                      src={editingProject.image || "/placeholder.svg"}
                      alt={editingProject.title}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("edit-project-image-upload")?.click()}
                  >
                    Change Image
                  </Button>
                  <input
                    id="edit-project-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProjectImageUpload}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={updateProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden trigger for add project dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <button id="add-project-trigger" className="hidden"></button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                placeholder="Enter project title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-type">Project Type</Label>
              <Select value={newProject.type} onChange={(value: any) => setNewProject({ ...newProject, type: value })}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spotify">Spotify Album</SelectItem>
                  <SelectItem value="soundcloud">SoundCloud</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-url">URL</Label>
              <Input
                id="project-url"
                value={newProject.url}
                onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                placeholder={newProject.type === "spotify" ? "https://open.spotify.com/album/..." : "https://..."}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-image">Custom Image (Optional)</Label>
              <div className="flex items-center gap-2">
                {newProject.image && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={newProject.image || "/placeholder.svg"}
                      alt="Project preview"
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("project-image-upload")?.click()}
                >
                  Upload Image
                </Button>
                <input
                  id="project-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProjectImageUpload}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={addNewProject}>Add Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

