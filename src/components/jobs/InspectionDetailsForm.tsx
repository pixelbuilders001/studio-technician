
"use client";

import { useState, useEffect } from "react";
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
import { useTranslation } from "@/hooks/useTranslation";
import { type Job } from "@/lib/types";
import { Loader2, X } from "lucide-react";
import { saveInspectionDetailsAction, getIssuesForCategoryAction } from "@/app/actions";
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
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof inspectionDetailsSchema>>({
    resolver: zodResolver(inspectionDetailsSchema),
    defaultValues: {
      selected_issues: [],
      other_findings: "",
      inspection_fee: job.net_inspection_fee,
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
  }, [open, job.categories.id, toast]);

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
            formData.append('issue_image', values.issue_image);
        }

        const result = await saveInspectionDetailsAction(formData);

        toast({
            title: result.message || t('inspection_details_form.toast_title_success'),
            description: t('inspection_details_form.toast_description_success'),
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


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inspection_details_form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField
              control={form.control}
              name="selected_issues"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">{t('inspection_details_form.findings_label')}</FormLabel>
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
                   <div className="flex flex-wrap gap-2 pt-2">
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
                  <FormLabel>{t('inspection_details_form.other_findings_label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('inspection_details_form.other_findings_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="issue_image"
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                    <FormLabel>{t('inspection_details_form.upload_photo_label')}</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" capture="environment" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inspection_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inspection_details_form.inspection_fee_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 300" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">{t('repair_details_form.cancel_button')}</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading || isFetchingIssues}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('inspection_details_form.submit_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
    