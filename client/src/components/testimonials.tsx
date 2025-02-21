import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Testimonials() {
  const testimonials = [
    {
      text: "Srinivas led our cloud migration project with exceptional expertise. His strategic approach saved us 40% in infrastructure costs while improving system reliability.",
      author: "Sarah Chen",
      role: "CTO, TechCorp",
      avatar: "/uploads/avatar-1.jpg",
    },
    {
      text: "The data governance framework Srinivas implemented transformed how we handle data. His attention to security and compliance was outstanding.",
      author: "Michael Rodriguez",
      role: "Head of Data, FinanceFlow",
      avatar: "/uploads/avatar-2.jpg",
    },
    {
      text: "Working with Srinivas on our system architecture modernization was eye-opening. His technical leadership and clear communication made complex transitions smooth.",
      author: "Emily Zhang",
      role: "VP Engineering, CloudScale",
      avatar: "/uploads/avatar-3.jpg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16 bg-accent/5">
      <h2 className="text-3xl font-bold mb-8 text-center">Client Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic mb-6">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
