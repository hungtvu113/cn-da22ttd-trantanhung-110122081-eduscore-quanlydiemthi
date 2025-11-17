"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Search, Download, Award, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Score = {
  id: string
  examCode: string
  examName: string
  subject: string
  date: string
  score: number
  grade: string
  notes: string
  teacher: string
}

// Mock data
const mockSubjects = [
  { id: "all", name: "Tất cả môn thi" },
  { id: "ENG101", name: "Tiếng Anh Cơ bản" },
  { id: "ENG201", name: "Tiếng Anh Giao tiếp" },
  { id: "ENG301", name: "Tiếng Anh Nâng cao" },
]

const scoresData: Score[] = [
  {
    id: "1",
    examCode: "EX2024001",
    examName: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    subject: "Tiếng Anh Cơ bản",
    date: "2024-01-25",
    score: 8.0,
    grade: "Giỏi",
    notes: "Khá tốt",
    teacher: "Nguyễn Thị Lan",
  },
  {
    id: "2",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    subject: "Tiếng Anh Giao tiếp",
    date: "2024-02-15",
    score: 8.5,
    grade: "Giỏi",
    notes: "Làm bài tốt",
    teacher: "Nguyễn Thị Lan",
  },
]

export default function StudentScoresPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const filteredScores = scoresData.filter((score) => {
    const matchesSearch =
      score.examCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      score.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      score.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSubject =
      selectedSubject === "all" || score.subject === mockSubjects.find(s => s.id === selectedSubject)?.name

    return matchesSearch && matchesSubject
  })

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Xuất sắc": "text-purple-500 bg-purple-500/10 border-purple-500/20",
      "Giỏi": "text-blue-500 bg-blue-500/10 border-blue-500/20",
      "Khá": "text-green-500 bg-green-500/10 border-green-500/20",
      "Trung bình": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
      "Yếu": "text-orange-500 bg-orange-500/10 border-orange-500/20",
      "Kém": "text-red-500 bg-red-500/10 border-red-500/20",
    }
    return colors[grade] || "text-gray-500 bg-gray-500/10 border-gray-500/20"
  }

  const totalScores = filteredScores.length
  const averageScore =
    totalScores > 0
      ? filteredScores.reduce((sum, score) => sum + score.score, 0) / totalScores
      : 0
  const highestScore = totalScores > 0 ? Math.max(...filteredScores.map(s => s.score)) : 0
  const lowestScore = totalScores > 0 ? Math.min(...filteredScores.map(s => s.score)) : 0

  const handleExportPDF = () => {
    alert("Đang xuất file PDF...\nChức năng sẽ được hoàn thiện sau!")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tra cứu Điểm</h1>
              <p className="text-muted-foreground">
                Xem điểm các kỳ thi đã tham gia
              </p>
            </div>
          </div>
          <Button className="gap-2" onClick={handleExportPDF}>
            <Download className="w-4 h-4" />
            Xuất PDF
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số kỳ thi</p>
              <p className="text-3xl font-bold">{totalScores}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              <p className="text-3xl font-bold">{averageScore.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điểm cao nhất</p>
              <p className="text-3xl font-bold">{highestScore.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điểm thấp nhất</p>
              <p className="text-3xl font-bold">{lowestScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã kỳ thi, tên, môn thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[250px]">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo môn thi" />
            </SelectTrigger>
            <SelectContent>
              {mockSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Scores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border rounded-lg bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Mã kỳ thi</TableHead>
              <TableHead>Tên kỳ thi</TableHead>
              <TableHead>Môn thi</TableHead>
              <TableHead>Ngày thi</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Xếp loại</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead>Giáo viên</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScores.length > 0 ? (
              filteredScores.map((score, index) => (
                <motion.tr
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-mono font-medium">
                    {score.examCode}
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {score.examName}
                  </TableCell>
                  <TableCell>{score.subject}</TableCell>
                  <TableCell>
                    {new Date(score.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <span className="text-lg font-bold text-green-500">
                      {score.score.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getGradeColor(
                        score.grade
                      )}`}
                    >
                      <Award className="w-3 h-3" />
                      {score.grade}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                    {score.notes || "-"}
                  </TableCell>
                  <TableCell className="text-sm">{score.teacher}</TableCell>
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-12 h-12 text-muted-foreground/20" />
                    <p className="text-muted-foreground">
                      Không tìm thấy điểm nào
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Score Distribution Chart */}
      {filteredScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Biểu đồ điểm
          </h3>
          <div className="space-y-4">
            {filteredScores.map((score, index) => {
              const percentage = (score.score / 10) * 100
              return (
                <div key={score.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[300px]">
                      {score.subject}
                    </span>
                    <span className="text-muted-foreground">
                      {score.score.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}

