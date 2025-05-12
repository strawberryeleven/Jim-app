import React, { useState, ChangeEvent, FormEvent } from "react";
import { UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface Measurements {
  chest: string;
  waist: string;
  arms: string;
  weight: string;
}

const MeasurementsPage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // format as YYYY-MM-DD
  });

  const [measurements, setMeasurements] = useState<Measurements>({
    chest: "",
    waist: "",
    arms: "",
    weight: "",
  });

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // You can store or send `imageFile` and `measurements` to backend here
    console.log("Image:", imageFile);
    console.log("Measurements:", measurements);
    console.log("Date:", date);

    alert("Measurements saved successfully!");
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center mb-4">
        <Link to="/profile">
          <ArrowLeft className="w-5 h-5 mr-3  text-white" />
        </Link>
        <h1 className="text-xl font-semibold">Track Your Measurements</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <label className="block mb-1 text-sm font-medium">Date (mm/dd/yyyy)</label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            required
            className="w-full p-2 pr-10 bg-gray-800 border border-gray-700 rounded text-white appearance-none"
          />
        </div>

        {/* Upload Image */}
        <div className="mb-6 ">
          <label className="block mb-2 text-sm font-semibold text-gray-200">
            Upload Progress Photo
          </label>

          <div className="flex items-center gap-4">
            <label
              htmlFor="file-upload"
              className="flex w-full items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md cursor-pointer hover:bg-gray-600 transition duration-200"
            >
              <UploadCloud size={18} className="text-white" />
              <span>Choose File</span>
            </label>

            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
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
            <label className="block mb-1">Body Weight (kg)</label>
            <input
              type="number"
              name="weight"
              min="0"
              value={measurements.weight}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Chest (in)</label>
            <input
              type="number"
              name="chest"
              min="0"
              value={measurements.chest}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Waist (in)</label>
            <input
              type="number"
              name="waist"
              min="0"
              value={measurements.waist}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Arms (in)</label>
            <input
              type="number"
              name="arms"
              min="0"
              value={measurements.arms}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 rounded text-white hover:bg-blue-500 transition-colors"
        >
          Save Progress
        </button>
      </form>
    </div>
  );
};

export default MeasurementsPage;
