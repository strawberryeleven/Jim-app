import React, { useState, ChangeEvent, FormEvent } from "react";
import { UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateMeasurementsAsync } from "@/store/slices/profileSlice";
import { Button } from "@/components/buttons/button";

export interface Measurements {
  chest: string;
  waist: string;
  arms: string;
  weight: string;
}

const MeasurementsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const updateStatus = useSelector((state: RootState) => state.profile.updateStatus);
  const error = useSelector((state: RootState) => state.profile.error);
  const profile = useSelector((state: RootState) => state.profile.data);

  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const [measurements, setMeasurements] = useState<Measurements>({
    chest: profile?.measurements?.chest?.toString() || "",
    waist: profile?.measurements?.waist?.toString() || "",
    arms: profile?.measurements?.arms?.toString() || "",
    weight: profile?.measurements?.weight?.toString() || "",
  });

  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!measurements.weight || !measurements.chest || !measurements.waist || !measurements.arms) {
      setValidationError("Please fill in all measurements.");
      return;
    }

    const measurementsData = {
      weight: parseFloat(measurements.weight),
      chest: parseFloat(measurements.chest),
      waist: parseFloat(measurements.waist),
      arms: parseFloat(measurements.arms),
      date: new Date(date).toISOString(),
    };

    try {
      await dispatch(updateMeasurementsAsync(measurementsData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      // Error is handled by the Redux state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/settings")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Track Your Measurements</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {validationError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
              {validationError}
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 font-medium">
              Measurements saved successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:border-zinc-700 transition-colors"
                disabled={updateStatus === 'loading'}
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Upload Progress Photo
              </label>

              <div className="flex items-center gap-4">
                <label
                  htmlFor="file-upload"
                  className={`flex w-full items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white cursor-pointer hover:bg-zinc-800 transition-colors ${
                    updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <UploadCloud size={18} className="text-gray-400" />
                  <span>Choose File</span>
                </label>

                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={updateStatus === 'loading'}
                />

                {image && (
                  <span className="text-green-400 text-sm">Image selected</span>
                )}
              </div>

              {image && (
                <div className="mt-4">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-48 h-auto rounded-lg border border-zinc-800 shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Measurements */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Body Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  min="0"
                  value={measurements.weight}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  required
                  disabled={updateStatus === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Chest (in)</label>
                <input
                  type="number"
                  name="chest"
                  min="0"
                  value={measurements.chest}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  required
                  disabled={updateStatus === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Waist (in)</label>
                <input
                  type="number"
                  name="waist"
                  min="0"
                  value={measurements.waist}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  required
                  disabled={updateStatus === 'loading'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Arms (in)</label>
                <input
                  type="number"
                  name="arms"
                  min="0"
                  value={measurements.arms}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  required
                  disabled={updateStatus === 'loading'}
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium rounded-xl transition-colors"
              disabled={updateStatus === 'loading'}
            >
              {updateStatus === 'loading' ? 'Saving...' : 'Save Progress'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeasurementsPage;
