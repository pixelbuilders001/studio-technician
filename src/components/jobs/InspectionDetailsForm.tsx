
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { type Job } from "@/lib/types";
import { Loader2, X, Camera } from "lucide-react";
import { saveInspectionDetailsAction, getIssuesForCategoryAction, updateJobStatusAction } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";

const inspectionDetailsSchema = z.object({
  selected_issues: z.array(z.string()).refine(value => value.length > 0, {
    message: "You must select at least one issue.",
  }),
  other_findings: z.string().optional(),
  inspection_fee: z.coerce.number().min(0, { message: "Please enter a valid fee." }),
  issue_image: z.any().optional(),
});

type Issue = {
  id: string;
  title: string;
  estimated_price: number;
}

type InspectionDetailsFormProps = {
  job: Job;
  technicianId: string;
  children: React.ReactNode;
  onFormSubmit: () => void;
}

export function InspectionDetailsForm({ job, technicianId, children, onFormSubmit }: InspectionDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isFetchingIssues, setIsFetchingIssues] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const form = useForm<z.infer<typeof inspectionDetailsSchema>>({
    resolver: zodResolver(inspectionDetailsSchema),
    defaultValues: {
      selected_issues: [],
      other_findings: "",
      inspection_fee: job.net_inspection_fee,
      issue_image: null,
    },
  });

  const selectedIssues = form.watch("selected_issues");

  useEffect(() => {
    if (open && job.categories.id) {
      const fetchIssues = async () => {
        setIsFetchingIssues(true);
        try {
          const fetchedIssues = await getIssuesForCategoryAction(job.categories.id);
          setIssues(fetchedIssues);
        } catch (error) {
          console.error("Failed to fetch issues:", error);
          toast({
            title: "Error",
            description: "Could not load issues for this category.",
            variant: "destructive",
          });
        } finally {
          setIsFetchingIssues(false);
        }
      };
      fetchIssues();
    }
    // Reset form and preview on close
    if (!open) {
      form.reset({
        selected_issues: [],
        other_findings: "",
        inspection_fee: job.net_inspection_fee,
        issue_image: null
      });
      setImagePreview(null);
    }
  }, [open, job.categories.id, job.net_inspection_fee, toast, form]);

  const onSubmit = async (values: z.infer<typeof inspectionDetailsSchema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('booking_id', job.id);
      formData.append('technician_id', technicianId);
      formData.append('inspection_fee', String(values.inspection_fee));

      const allFindings = [...values.selected_issues];
      if (values.other_findings) {
        allFindings.push(`Other: ${values.other_findings}`);
      }
      formData.append('findings', JSON.stringify(allFindings));

      if (values.issue_image) {
        formData.append('issue_image_url', values.issue_image);
      }

      await saveInspectionDetailsAction(formData);

      // Now, update the job status
      await updateJobStatusAction({
        booking_id: job.id,
        order_id: job.order_id,
        status: 'inspection_completed',
        note: 'Technician has completed the inspection.'
      });

      toast({
        title: "Inspection Completed",
        description: "Findings have been saved.",
      });

      setOpen(false);
      onFormSubmit();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not save inspection details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssueSelect = (issueTitle: string) => {
    const currentIssues = form.getValues("selected_issues") || [];
    if (!currentIssues.includes(issueTitle)) {
      form.setValue("selected_issues", [...currentIssues, issueTitle]);
    }
  };

  const handleRemoveIssue = (issueTitle: string) => {
    const currentIssues = form.getValues("selected_issues") || [];
    form.setValue(
      "selected_issues",
      currentIssues.filter((issue) => issue !== issueTitle)
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('issue_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('issue_image', null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inspection Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

            <FormField
              control={form.control}
              name="selected_issues"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Select all applicable issues</FormLabel>
                  {isFetchingIssues ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select onValueChange={handleIssueSelect} value="">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Add an issue from the list" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {issues.filter(issue => !selectedIssues.includes(issue.title)).map(issue => (
                          <SelectItem key={issue.id} value={issue.title}>
                            {issue.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className="flex flex-wrap gap-2 pt-2 min-h-[24px]">
                    {selectedIssues.map(issue => (
                      <Badge key={issue} variant="secondary" className="flex items-center gap-1">
                        {issue}
                        <button type="button" onClick={() => handleRemoveIssue(issue)} className="rounded-full hover:bg-muted-foreground/20">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="other_findings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Other Findings (if any)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe any other issues found..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue_image"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Issue Photo</FormLabel>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                        <Image src={imagePreview} alt="Issue preview" layout="fill" objectFit="cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Camera className="mr-2 h-4 w-4" />
                        Take Photo
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="inspection_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Inspection Fee</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading || isFetchingIssues}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Findings
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
