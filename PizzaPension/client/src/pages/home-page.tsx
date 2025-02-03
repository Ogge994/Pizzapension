import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRegistrationSchema } from "@db/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Pizza, Calendar, MapPin, Users, Info } from "lucide-react";
import { motion } from "framer-motion";

const PIZZA_OPTIONS = [
  "Hawaii",
  "Kebabpizza",
  "Tomaso",
  "La Maffia",
  "Capriciosa",
  "Cacciatora",
  "Vesuvio",
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function HomePage() {
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(insertRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      pizza: "",
      drink: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/register-event", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registrering mottagen!",
        description: "Tack för din anmälan till Pizza & Pension.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Ett fel uppstod",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-lg"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <Card className="backdrop-blur-sm bg-white/95 shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center space-x-3">
              <Pizza className="h-8 w-8 text-red-500 animate-pulse" />
              <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700">
                Pizza & Pension
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-red-50 border-red-200">
              <Info className="h-5 w-5 text-red-500" />
              <AlertDescription className="ml-2">
                <div className="space-y-4">
                  <p className="font-medium text-lg text-red-700">Välkommen till Pizza & Pension!</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <p><span className="font-medium">När?</span> Onsdagen den 26 Februari, start kl. 15:50 med pizza</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <p><span className="font-medium">Var?</span> Portalen, E-hallen</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-red-500" />
                      <p><span className="font-medium">För vem?</span> Medlemmar som är 35 år eller yngre</p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                    <li>Pensionsgenomgång med Leif Hjelman från Folksam</li>
                    <li>Vi bjuder på pizza och dryck</li>
                    <li>Begränsat till 18 deltagare - först till kvarn!</li>
                    <li className="font-medium text-red-600">OBS! Sker på obetald tid</li>
                    <li className="font-medium">Anmäl dig senast 14 Februari!</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Förnamn</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-red-100 focus:border-red-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Efternamn</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-red-100 focus:border-red-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-post</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} className="border-red-100 focus:border-red-500" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pizza"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pizza</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-red-100 focus:border-red-500">
                              <SelectValue placeholder="Välj pizza" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PIZZA_OPTIONS.map((pizza) => (
                              <SelectItem key={pizza} value={pizza}>
                                {pizza}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="drink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dryck</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Skriv in önskad dryck" className="border-red-100 focus:border-red-500" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
                  >
                    Skicka anmälan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    asChild
                    className="border-red-200 hover:bg-red-50"
                  >
                    <Link href="/admin">Admin</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}