"use client"

import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Github } from "lucide-react"
import Link from "next/link"

const footerLinks = {
  product: [
    { label: "Tính năng", href: "#features" },
    { label: "Demo", href: "/demo" },
    { label: "Tài liệu", href: "#docs" },
    { label: "Hướng dẫn", href: "#guide" },
  ],
  resources: [
    { label: "Giới thiệu dự án", href: "#about" },
    { label: "Tài liệu kỹ thuật", href: "#tech-docs" },
    { label: "GitHub", href: "#github" },
    { label: "Đóng góp", href: "#contribute" },
  ],
  support: [
    { label: "Báo lỗi", href: "#issues" },
    { label: "Yêu cầu tính năng", href: "#feature-request" },
    { label: "Cộng đồng", href: "#community" },
    { label: "Liên hệ", href: "#contact" },
  ],
}

const socialLinks = [
  { icon: Github, href: "https://github.com/hungtvu113/DoAnChuyenNganh", label: "GitHub Repository" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                QuizHub
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Dự án quản lý kỳ thi cho Trung tâm Ngoại ngữ - Tin học.
              Được xây dựng với Next.js, TypeScript và Tailwind CSS.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>Dự án mã nguồn mở</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                <span>Dự án học tập & nghiên cứu</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Dự án</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Tài nguyên</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} QuizHub - Dự án quản lý kỳ thi. Made with ❤️ in Vietnam
          </p>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

