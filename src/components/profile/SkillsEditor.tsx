import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PlusIcon, XIcon } from 'lucide-react'

interface SkillsEditorProps {
  skills: string[]
  onChange: (skills: string[]) => void
}

export function SkillsEditor({ skills, onChange }: SkillsEditorProps) {
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onChange([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddSkill()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="スキルを入力（例：React, Node.js, デザイン）"
          className="flex-1"
        />
        <Button type="button" onClick={handleAddSkill} size="icon">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="pr-1">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="ml-2 hover:text-red-600 transition-colors"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        最大10個までスキルを追加できます。現在: {skills.length}/10
      </p>
    </div>
  )
}