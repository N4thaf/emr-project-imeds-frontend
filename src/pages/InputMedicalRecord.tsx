import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Save, Search, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TopNav } from "@/components/navigation/top-nav";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { usePatient } from "@/hooks/use-patient";
import { Label } from "@/components/ui/label";
import { PatientData } from "..";

const medicalRecordSchema = z.object({
  // Diagnosis
  diagnosis: z.object({
    date: z.date({ required_error: "Diagnosis date is required" }),
    diagnosis: z.string().min(1, "Diagnosis is required"),
    icd10: z.string().min(1, "ICD-10 code is required"),
    doctor: z.string().min(1, "Doctor name is required"),
  }),
  
  // Vitals
  vitals: z.object({
    date: z.date({ required_error: "Vitals date is required" }),
    time: z.string().min(1, "Time is required"),
    bloodPressure: z.string().min(1),
    heartRate: z.string().min(1),
    temperature: z.string().min(1),
    weight: z.string().min(1),
    height: z.string().min(1),
  }),

  // Lab Results
  labResults: z.object({
    date: z.date({ required_error: "Lab date is required" }),
    testName: z.string().min(1),
    result: z.string().min(1),
    referenceRange: z.string().min(1),
    status: z.string().min(1),
  }),

  // Treatments
  treatments: z.object({
    date: z.date({ required_error: "Treatment date is required" }),
    medication: z.string().min(1),
    dosage: z.string().min(1),
    duration: z.string().min(1),
    doctor: z.string().min(1),
  }),

  // Consultation Notes
  consultationNotes: z.object({
    date: z.date({ required_error: "Consultation date is required" }),
    doctor: z.string().min(1),
    specialty: z.string().min(1),
    chiefComplaint: z.string().min(1),
    assessment: z.string().min(1),
    plan: z.string().min(1),
  }),

  // Disposition
  disposition: z.object({
    date: z.date({ required_error: "Disposition date is required" }),
    status: z.string().min(1),
    instructions: z.string().min(1),
    nextAppointment: z.date().optional(),
  }),
});

type MedicalRecordFormData = z.infer<typeof medicalRecordSchema>;

export default function InputMedicalRecord() {
  const [nik, setNik] = useState("");
  const [showRecord, setShowRecord] = useState(false);
  const [patientData, setPatentData] = useState<PatientData | null>(null)
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);

  const { data, loading, error, fetchPatient } = usePatient();
  
  const form = useForm<MedicalRecordFormData>({
    resolver: zodResolver(medicalRecordSchema)
  });

  const onSubmit = async (data: MedicalRecordFormData) => {
	setFormLoading(true);
	let status = 0;
	try {
 		const res = await fetch(`https://emr-project-imeds-backend.vercel.app/api/pasien/${nik}`, {
          method: "POST",
          headers: {
          	"Content-Type": "application/json",
          },
          body: JSON.stringify({
			  diagnosis: data.diagnosis, 
			  vitals: data.vitals, 
			  labResults: data.labResults, 
			  treatments: data.treatments, 
			  consultationNotes: data.consultationNotes, 
			  disposition: data.disposition 
          }),
        });

  		if (!res.ok) {
		  const err = await res.json();
		  toast({
			title: "Something Went Wrong",
			description: err.message || "Failed to save medical record"		  
		  })
    	}
	} catch(err) {
		toast({
			title: "Something Went Wrong",
			description: "Something went wrong about this"
		})
	} finally {
		if(status >= 300) {
			toast({
				title: "Something Went Wrong",
				description: "Something went wrong about this"
			})
		} else {
			setFormLoading(false);
			toast({
			  title: "Medical Record Saved",
			  description: "Patient medical record has been successfully saved.",
			});
			navigate("/home");
		}
	}
  };

  const handleCancel = () => {
    navigate("/home");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length >= 10) {
      fetchPatient(nik);

    } else {
      toast({
        title: "Invalid NIK",
        description: "Please enter a valid NIK (minimum 10 digits)",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
	  if(data !== null) {
		  setPatentData(data)
		  setShowRecord(true)

      	  toast({
        	title: "Patient Found",
            description: `Medical record for NIK ${nik} loaded successfully`,
          });
	  }
  }, [data])

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Search className="h-6 w-6 text-medical-red" />
              <div>
                <CardTitle>Search Patient by NIK</CardTitle>
                <CardDescription>
                  Enter the National ID Number (NIK) to access patient medical records
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="nik" className="sr-only">NIK</Label>
                <Input
                  id="nik"
                  type="text"
                  placeholder="Enter NIK (e.g., 3201234567890123)"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" variant="medical" size="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

		{(showRecord && !loading) && (
		<>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Input Patient Medical Record</h1>
          <p className="text-muted-foreground">
            Complete patient medical record form for consultation documentation
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={formLoading ? (() => {}) : form.handleSubmit(onSubmit)} className="space-y-8">
             <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-medical-red" />
                  <CardTitle>Patient Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">NIK</Label>
                    <p className="text-lg font-semibold">{patientData.personalInfo.nik}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Birth Date</Label>
                    <p className="text-lg">{patientData.personalInfo.birthDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <p className="text-lg">{patientData.personalInfo.gender}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-lg">{patientData.personalInfo.phone}</p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-lg">{patientData.personalInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Diagnosis */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Diagnosis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="diagnosis.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Diagnosis Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diagnosis.doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter doctor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="diagnosis.diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter diagnosis details" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis.icd10"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ICD-10 Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter ICD-10 code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Vitals */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Vital Signs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="vitals.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vitals.time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="vitals.bloodPressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Pressure (mmHg)</FormLabel>
                        <FormControl>
                          <Input placeholder="120/80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vitals.heartRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Heart Rate (bpm)</FormLabel>
                        <FormControl>
                          <Input placeholder="72" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vitals.temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <Input placeholder="36.5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="vitals.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vitals.height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input placeholder="170" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lab Results */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Lab Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="labResults.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="labResults.testName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter test name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="labResults.result"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Result</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter result" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="labResults.referenceRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Range</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter reference range" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="labResults.status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="abnormal">Abnormal</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Treatments */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Treatments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="treatments.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatments.doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter doctor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="treatments.medication"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medication" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatments.dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter dosage" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="treatments.duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter duration" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Consultation Notes */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Consultation Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="consultationNotes.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consultationNotes.doctor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doctor</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter doctor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consultationNotes.specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter specialty" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="consultationNotes.chiefComplaint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chief Complaint</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter chief complaint" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationNotes.assessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assessment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter assessment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultationNotes.plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter plan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Disposition */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-medical-red">Disposition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="disposition.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="disposition.status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="discharged">Discharged</SelectItem>
                            <SelectItem value="admitted">Admitted</SelectItem>
                            <SelectItem value="transferred">Transferred</SelectItem>
                            <SelectItem value="referred">Referred</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="disposition.instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructions</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter instructions" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="disposition.nextAppointment"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Appointment (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-8"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
			  	disabled={formLoading}
                type="submit"
                variant="medical"
                className="px-8"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Record
              </Button>
            </div>
          </form>
        </Form>
		</>
      )}
      </main>
    </div>
  );
};
