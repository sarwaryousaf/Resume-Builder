"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera, Download } from "lucide-react"
import { jsPDF } from "jspdf"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const colorOptions = [
  { name: 'Indigo', value: 'indigo' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Rose', value: 'rose' },
  { name: 'Amber', value: 'amber' },
]

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState({
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })
  const [picture, setPicture] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState('indigo')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setResumeData(prev => ({ ...prev, [name]: value }))
  }

  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const downloadResume = () => {
    const doc = new jsPDF()
    
    // Add content to PDF
    doc.setFontSize(20)
    doc.setTextColor(getColorHex(selectedColor))
    doc.text(resumeData.name || 'Your Name', 20, 20)
    
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(resumeData.email || 'your.email@example.com', 20, 30)
    doc.text(resumeData.phone || '(123) 456-7890', 20, 37)
    
    doc.setFontSize(16)
    doc.setTextColor(getColorHex(selectedColor))
    doc.text('Professional Summary', 20, 50)
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    const summaryLines = doc.splitTextToSize(resumeData.summary || 'Your professional summary...', 170)
    doc.text(summaryLines, 20, 60)
    
    doc.setFontSize(16)
    doc.setTextColor(getColorHex(selectedColor))
    doc.text('Work Experience', 20, 90)
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    const experienceLines = doc.splitTextToSize(resumeData.experience || 'Your work experience...', 170)
    doc.text(experienceLines, 20, 100)
    
    doc.setFontSize(16)
    doc.setTextColor(getColorHex(selectedColor))
    doc.text('Education', 20, 140)
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    const educationLines = doc.splitTextToSize(resumeData.education || 'Your education details...', 170)
    doc.text(educationLines, 20, 150)
    
    doc.setFontSize(16)
    doc.setTextColor(getColorHex(selectedColor))
    doc.text('Skills', 20, 180)
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    const skillsLines = doc.splitTextToSize(resumeData.skills || 'Your skills...', 170)
    doc.text(skillsLines, 20, 190)
    
    // Add profile picture if available
    if (picture) {
      doc.addImage(picture, 'JPEG', 160, 20, 30, 30)
    }
    
    // Save the PDF
    doc.save('resume.pdf')
  }

  const getColorHex = (color: string) => {
    switch (color) {
      case 'blue': return '#083987'
      case 'emerald': return '#10b981'
      case 'rose': return '#e11d48'
      case 'amber': return '#d97706'
      default: return '#4f46e5'
    }
  }

  return (
    <div className={`min-h-screen bg-${selectedColor}-50 py-12 px-4 sm:px-6 lg:px-8`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className={`text-4xl font-bold text-${selectedColor}-800 text-center mb-12`}>Resume Builder</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className={`text-2xl font-semibold text-${selectedColor}-700 mb-6`}>Enter Your Details</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="picture-upload" className={`block text-sm font-medium text-${selectedColor}-700 mb-2`}>
                  Profile Picture
                </Label>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={picture || ''} alt="Profile picture" />
                    <AvatarFallback className={`bg-${selectedColor}-100 text-${selectedColor}-700`}>
                      <Camera className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" onClick={triggerFileInput} variant="outline" className={`text-${selectedColor}-600 hover:text-${selectedColor}-700`}>
                    Upload Picture
                  </Button>
                  <Input
                    id="picture-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePictureUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={resumeData.name}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={resumeData.email}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={resumeData.phone}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
              />
              <Textarea
                name="summary"
                placeholder="Professional Summary"
                value={resumeData.summary}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
                rows={4}
              />
              <Textarea
                name="experience"
                placeholder="Work Experience"
                value={resumeData.experience}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
                rows={4}
              />
              <Textarea
                name="education"
                placeholder="Education"
                value={resumeData.education}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
                rows={4}
              />
              <Textarea
                name="skills"
                placeholder="Skills"
                value={resumeData.skills}
                onChange={handleInputChange}
                className={`w-full border-${selectedColor}-300 focus:border-${selectedColor}-500 focus:ring-${selectedColor}-500`}
                rows={4}
              />
              <div>
                <Label className={`block text-sm font-medium text-${selectedColor}-700 mb-2`}>
                  Choose Theme Color
                </Label>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex space-x-2"
                >
                  {colorOptions.map((color) => (
                    <div key={color.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={color.value}
                        id={color.value}
                        className={`bg-${color.value}-400`}
                      />
                      <Label htmlFor={color.value}>{color.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button className={`w-full bg-${selectedColor}-600 hover:bg-${selectedColor}-700 text-blue`}>
                Generate Resume
              </Button>
            </form>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl bg-#083987 font-semibold text-${selectedColor}-700`}>Resume Preview</h2>
              <Button onClick={downloadResume} className={`bg-${selectedColor}-600 hover:bg-${selectedColor}-700 text-black`}>
                <Download className="w-4 h-4 mr-2 " />
                Download Resume
              </Button>
            </div>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center space-x-4 border-b border-${selectedColor}-200 pb-4`}
              >
                <Avatar className="w-20 h-20">
                  <AvatarImage src={picture || ''} alt="Profile picture" />
                  <AvatarFallback className={`bg-${selectedColor}-100 text-${selectedColor}-700`}>
                    <Camera className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className={`text-xl font-bold text-${selectedColor}-800`}>{resumeData.name || 'Your Name'}</h3>
                  <p className={`text-${selectedColor}-600`}>{resumeData.email || 'your.email@example.com'}</p>
                  <p className={`text-${selectedColor}-600`}>{resumeData.phone || '(123) 456-7890'}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`border-b border-${selectedColor}-200 pb-4`}
              >
                <h4 className={`text-lg font-semibold text-${selectedColor}-700 mb-2`}>Professional Summary</h4>
                <p className={`text-${selectedColor}-900`}>{resumeData.summary || 'Your professional summary goes here...'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={`border-b border-${selectedColor}-200 pb-4`}
              >
                <h4 className={`text-lg font-semibold text-${selectedColor}-700 mb-2`}>Work Experience</h4>
                <p className={`text-${selectedColor}-900`}>{resumeData.experience || 'Your work experience goes here...'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`border-b border-${selectedColor}-200 pb-4`}
              >
                <h4 className={`text-lg font-semibold text-${selectedColor}-700 mb-2`}>Education</h4>
                <p className={`text-${selectedColor}-900`}>{resumeData.education || 'Your education details go here...'}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h4 className={`text-lg font-semibold text-${selectedColor}-700 mb-2`}>Skills</h4>
                <p className={`text-${selectedColor}-900`}>{resumeData.skills || 'Your skills go here...'}</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}