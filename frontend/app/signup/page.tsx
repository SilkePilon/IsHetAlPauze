"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  User,
  Mail,
  Lock,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const steps = [
  { title: "Personal Info", icon: User },
  { title: "Contact", icon: Mail },
  { title: "Security", icon: Lock },
  { title: "Role", icon: GraduationCap },
];

const passwordRequirements = [
  { id: "length", label: "At least 7 characters long", regex: /.{7,}/ },
  { id: "uppercase", label: "Contains an uppercase letter", regex: /[A-Z]/ },
  { id: "lowercase", label: "Contains a lowercase letter", regex: /[a-z]/ },
  { id: "number", label: "Contains a number", regex: /\d/ },
  {
    id: "special",
    label: "Contains a special character",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher" | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState<{
    [key: string]: boolean;
  }>({});
  const [stepValidity, setStepValidity] = useState([
    false,
    false,
    false,
    false,
  ]);
  const router = useRouter();
  const { signup } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const strength: { [key: string]: boolean } = {};
    passwordRequirements.forEach((req) => {
      strength[req.id] = req.regex.test(password);
    });
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    const newStepValidity = [...stepValidity];
    newStepValidity[0] = name.trim().length > 0;
    newStepValidity[1] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    newStepValidity[2] =
      Object.values(passwordStrength).every(Boolean) &&
      password === confirmPassword;
    newStepValidity[3] = role !== "";
    setStepValidity(newStepValidity);
  }, [name, email, password, confirmPassword, passwordStrength, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, password, role as "student" | "teacher");
      router.push("/");
      toast({
        title: "Successfully signed up!",
        description: "Welcome to our platform.",
        variant: "success",
      });
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Please check your information and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="john@example.com"
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`border-4 ${
                  password && Object.values(passwordStrength).every(Boolean)
                    ? "border-green-500"
                    : "border-red-500"
                }`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className={`border-4 ${
                  confirmPassword && password === confirmPassword
                    ? "border-green-500"
                    : "border-red-500"
                }`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold">Password Requirements:</p>
              <ul className="text-sm space-y-1">
                {passwordRequirements.map((req) => (
                  <li key={req.id} className="flex items-center">
                    {passwordStrength[req.id] ? (
                      <Check className="w-3 h-3 mr-2 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 mr-2 text-red-500" />
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-2">
            <Label htmlFor="role">I am a...</Label>
            <Select
              onValueChange={(value: "student" | "teacher") => setRole(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student - Here to learn</SelectItem>
                <SelectItem value="teacher">
                  Teacher - Here to educate
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="w-full overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-white-500 to-black-500 text-primary">
            <CardTitle className="text-2xl font-bold text-center">
              Create an Account
            </CardTitle>
            <CardDescription className="text-center text-primary/80">
              Join our community and start learning today
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col items-center ${
                      index <= currentStep ? "text-primary" : "text-gray-400"
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <step.icon className="w-4 h-4 mb-1" />
                    <span className="text-xs">{step.title}</span>
                  </motion.div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / steps.length) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="px-4 py-2"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    disabled={isLoading || !stepValidity[currentStep]}
                    className="px-4 py-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Signing Up...</span>
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!stepValidity[currentStep]}
                    className="px-4 py-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
