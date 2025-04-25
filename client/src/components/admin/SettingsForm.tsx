import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ReactNode } from 'react';

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
import { Button } from '@/components/ui/button';

interface SettingsFormField {
  key: string;
  label: string;
  description?: string;
  type?: 'text' | 'textarea' | 'email' | 'url';
  icon?: ReactNode;
}

interface SettingsFormProps {
  settings: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
  isPending: boolean;
  fields: SettingsFormField[];
}

export default function SettingsForm({ settings, onUpdate, isPending, fields }: SettingsFormProps) {
  // Create dynamic schema based on provided fields
  const formSchema = z.object(
    fields.reduce((acc, field) => {
      let validation = z.string();
      
      if (field.type === 'email') {
        validation = z.string().email(`Invalid email address`);
      } else if (field.type === 'url') {
        validation = z.string().url(`Invalid URL`);
      }
      
      return { ...acc, [field.key]: validation };
    }, {})
  );
  
  type FormValues = z.infer<typeof formSchema>;
  
  // Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: settings,
  });
  
  const onSubmit = (data: FormValues) => {
    // Find changed values and update them
    Object.entries(data).forEach(([key, value]) => {
      if (value !== settings[key]) {
        onUpdate(key, value);
      }
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.key}
            control={form.control}
            name={field.key as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <div className="relative">
                    {field.type === 'textarea' ? (
                      <Textarea 
                        {...formField} 
                        className={field.icon ? "pl-10" : ""}
                      />
                    ) : (
                      <Input 
                        type={field.type || 'text'} 
                        {...formField} 
                        className={field.icon ? "pl-10" : ""}
                      />
                    )}
                    {field.icon && (
                      <div className="absolute left-3 top-3">
                        {field.icon}
                      </div>
                    )}
                  </div>
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        
        <Button 
          type="submit" 
          disabled={isPending || !form.formState.isDirty}
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
