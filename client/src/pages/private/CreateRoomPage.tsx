import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../app/router/routePaths';
import { useRoom } from '../../features/room/hooks/useRoom';

const CreateRoomPage = () => {
    const { createRoom, isLoading, error: apiError, isSuccess } = useRoom();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const [validationError, setValidationError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        setValidationError(null);

        if (formData.name.trim().length < 3) {
            setValidationError("Nazwa kanału musi posiadać minimum 3 znaki.");
            return;
        }

        if (formData.description.length > 50) {
            setValidationError("Opis węzła nie może przekraczać 50 znaków.");
            return;
        }

        const newRoom = await createRoom({
            name: formData.name.trim(),
            description: formData.description.trim(),
        });

        if (newRoom) {
            setFormData({ name: "", description: "" });
            
            setTimeout(() => {
                navigate(ROUTES.CHAT);
            }, 1500);
        }
    };

    return (
    <div className="dark-auth-bg">
        <div className="dark-auth-card relative">
            
            <Link to={ROUTES.CHAT} className="absolute top-6 left-6 text-zinc-500 hover:text-sky-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </Link>

            <div className="text-center mt-2">
            <h2 className="text-3xl font-black tracking-tight text-zinc-100">Nowy Pokój</h2>
            <p className="mt-2 text-sm text-zinc-400">
                Zainicjuj nowy pokój w sieci.
            </p>
            </div>

            {isSuccess && (
            <div className="dark-auth-alert-success">
                Pokój utworzony pomyślnie. Przekierowywanie...
            </div>
            )}

            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            
            {(validationError || apiError) && (
                <div className="dark-auth-alert-error">
                {validationError || apiError}
                </div>
            )}

            <div>
                <label htmlFor="name" className="dark-auth-label">Nazwa kanału</label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-500/50 font-bold">
                        #
                    </span>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="dark-auth-input !pl-8"
                        placeholder="tech-news"
                    />
                </div>
            </div>

            <div>
                <div className="flex justify-between">
                    <label htmlFor="description" className="dark-auth-label">Opis tematyczny</label>
                    <span className={`text-xs ${formData.description.length > 50 ? 'text-red-400' : 'text-zinc-600'}`}>
                        {formData.description.length}/50
                    </span>
                </div>
                <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="dark-auth-input"
                placeholder="Dyskusje o nowych technologiach (max 50 znaków)..."
                />
            </div>

            <div className="pt-4">
                <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="dark-auth-btn-primary"
                >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-zinc-950" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Kompilacja...
                    </span>
                ) : (
                    'Utwórz pokój'
                )}
                </button>
            </div>
            </form>
        </div>
    </div>
    );
};

export default CreateRoomPage;