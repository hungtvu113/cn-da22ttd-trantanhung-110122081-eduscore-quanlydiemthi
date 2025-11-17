"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Liên hệ với chúng tôi</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Có thắc mắc hoặc cần hỗ trợ? Hãy liên hệ với chúng tôi
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Thông tin liên hệ</h3>
              <p className="text-muted-foreground mb-8">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Liên hệ với chúng tôi qua các kênh sau:
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-muted-foreground">admin@st.edu.tvu.vn</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phản hồi trong vòng 24 giờ
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Điện thoại</h4>
                  <p className="text-muted-foreground">+84 123 456 789</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thứ 2 - Thứ 6: 8:00 - 17:00
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-start gap-4 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Địa chỉ</h4>
                  <p className="text-muted-foreground">
                    Trường Đại học Trà Vinh
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    126 Nguyễn Thiện Thành, Khóm 4, Phường 5, TP. Trà Vinh
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border rounded-lg p-8 shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Gửi tin nhắn</h3>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  placeholder="Nguyễn Văn A"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Tiêu đề</Label>
                <Input
                  id="subject"
                  placeholder="Vấn đề cần hỗ trợ"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Nội dung</Label>
                <Textarea
                  id="message"
                  placeholder="Mô tả chi tiết vấn đề của bạn..."
                  rows={5}
                  className="w-full"
                />
              </div>

              <Button className="w-full gap-2" size="lg">
                <Send className="w-4 h-4" />
                Gửi tin nhắn
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

