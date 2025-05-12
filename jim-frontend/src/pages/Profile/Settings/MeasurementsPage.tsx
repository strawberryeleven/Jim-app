import React, { useState, ChangeEvent, FormEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { updateMeasurementsAsync } from "@/store/slices/profileSlice";

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
    <div className="p-4 text-gray-400">
      <div className="flex items-center space-x-3 mb-4">
        <Link to="/settings">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <h2 className="text-xl font-bold text-white">Track Your Measurements</h2>
      </div>

      {validationError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 mb-4">
          {validationError}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500 mb-4">
          Measurements saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            required
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            disabled={updateStatus === 'loading'}
          />
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-300">
            Upload Progress Photo
          </label>

          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className={`flex w-full items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded text-white cursor-pointer hover:bg-gray-700 transition-colors ${
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
                className="w-48 h-auto rounded-lg border border-gray-700 shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Measurements */}
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Body Weight (kg)</label>
            <input
              type="number"
              name="weight"
              min="0"
              value={measurements.weight}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
              disabled={updateStatus === 'loading'}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Chest (in)</label>
            <input
              type="number"
              name="chest"
              min="0"
              value={measurements.chest}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
              disabled={updateStatus === 'loading'}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Waist (in)</label>
            <input
              type="number"
              name="waist"
              min="0"
              value={measurements.waist}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
              disabled={updateStatus === 'loading'}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-300">Arms (in)</label>
            <input
              type="number"
              name="arms"
              min="0"
              value={measurements.arms}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              required
              disabled={updateStatus === 'loading'}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors ${
            updateStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={updateStatus === 'loading'}
        >
          {updateStatus === 'loading' ? 'Saving...' : 'Save Progress'}
        </button>
      </form>
    </div>
  );
};

export default MeasurementsPage;
