import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const emergencyDetailsSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  emergencyContactName: z.string().min(2, {
    message: 'Emergency contact name is required.',
  }),
  emergencyContactPhone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  notes: z.string().optional(),
});

type EmergencyDetailsFormValues = z.infer<typeof emergencyDetailsSchema>;

interface EmergencyDetailsFormProps {
  initialData?: EmergencyDetailsFormValues;
  onSave: (data: EmergencyDetailsFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EmergencyDetailsForm({
  initialData,
  onSave,
  onCancel,
  isLoading = false,
}: EmergencyDetailsFormProps) {
  const defaultValues: Partial<EmergencyDetailsFormValues> = {
    fullName: '',
    bloodType: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    notes: '',
    ...initialData,
  };

  const form = useForm<EmergencyDetailsFormValues>({
    resolver: zodResolver(emergencyDetailsSchema),
    defaultValues,
  });

  async function onSubmit(data: EmergencyDetailsFormValues) {
    try {
      await onSave(data);
      toast({
        title: 'Success',
        description: 'Emergency details saved successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save emergency details. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bloodType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., O+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allergies</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Penicillin, Peanuts" {...field} />
                </FormControl>
                <FormDescription>
                  List any known allergies, separated by commas.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medicalConditions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Conditions</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Diabetes, Asthma" {...field} />
                </FormControl>
                <FormDescription>
                  List any existing medical conditions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="medications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Medications</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Insulin, Ventolin" {...field} />
                </FormControl>
                <FormDescription>
                  List any medications you're currently taking.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyContactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyContactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Contact Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="+254 700 123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other important medical information..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
