import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Upload, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [newTechnology, setNewTechnology] = useState("");

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "text",
      content: "",
      challenge: "",
      approach: "",
      implementation: "",
      outcomes: [],
      technologies: [],
      thumbnail: "",
    },
  });

  const addTechnology = () => {
    if (newTechnology && !technologies.includes(newTechnology)) {
      setTechnologies([...technologies, newTechnology]);
      form.setValue("technologies", [...technologies, newTechnology]);
      setNewTechnology("");
    }
  };

  const removeTechnology = (tech: string) => {
    const updatedTech = technologies.filter(t => t !== tech);
    setTechnologies(updatedTech);
    form.setValue("technologies", updatedTech);
  };

  const onSubmit = async (data: InsertProject) => {
    try {
      setIsUploading(true);
      const formData = new FormData();

      // Add thumbnail if it exists
      const thumbnailFile = form.getValues("thumbnailFile");
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile[0]);
      }

      // Format the data
      const projectData = {
        ...data,
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
        technologies,
      };

      // Add project data
      formData.append("data", JSON.stringify(projectData));

      await apiRequest("POST", "/api/projects", formData);

      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success",
        description: "Project created successfully",
      });

      form.reset();
      setTechnologies([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="text">Case Study</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="slides">Slides</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("type") === "text" && (
                <>
                  <FormField
                    control={form.control}
                    name="challenge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Challenge</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="approach"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Approach</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="implementation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Implementation</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Technologies */}
                  <div className="space-y-2">
                    <FormLabel>Technologies</FormLabel>
                    <div className="flex gap-2">
                      <Input
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        placeholder="Add a technology..."
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={addTechnology}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tech}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => removeTechnology(tech)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <FormField
                control={form.control}
                name="thumbnailFile"
                render={({ field: { onChange, value, ...field } }) => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files)}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isUploading}>
                {isUploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Project
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}