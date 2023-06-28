import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
render(<IletisimFormu />);

});

test('iletişim formu headerı render ediliyor', () => {

    render(<IletisimFormu />);

    const header = screen.getByText('İletişim Formu');

    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();

});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {

    render(<IletisimFormu />);
    
    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, 'abc');

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    
    render(<IletisimFormu />);

    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(3);

    await waitFor(() => {
        const error = screen.getAllByTestId('error');
        expect(error).toHaveLength(3);
    });
    
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {

    render(<IletisimFormu />);

    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, 'İlhan');

    const soyadInput = screen.getByLabelText("Soyad*");
    userEvent.type(soyadInput, 'Mansız');

    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = await screen.findAllByTestId('error');
    expect(error).toHaveLength(1);

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {

    render(<IletisimFormu />);

    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'abc');

    const error = await screen.findByText(/email geçerli bir email adresi olmalıdır./i);
    expect(error).toBeInTheDocument();

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {

    render(<IletisimFormu />);

    //const adInput = screen.getByLabelText("Ad*");
    //userEvent.type(adInput, 'İlhan');

    //const emailInput = screen.getByLabelText(/email*/i);
    //userEvent.type(emailInput, 'elif@gmail.com'); 
    
    const button = screen.getByRole('button');
    userEvent.click(button);

    const error = await screen.findByText(/soyad gereklidir./i);
    expect(error).toBeInTheDocument();

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {

    render(<IletisimFormu />);

    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, 'Melih');
  
    const soyadInput = screen.getByLabelText("Soyad*");
    userEvent.type(soyadInput, 'Mansız');
  
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'test@example.com');
  
    const error = screen.queryByText(/Hata/i);
    expect(error).not.toBeInTheDocument();

    const button = screen.getByRole('button');
    userEvent.click(button);
  
  


});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {

    render(<IletisimFormu />);

    const adInput = screen.getByLabelText("Ad*");
    userEvent.type(adInput, 'Melih');
  
    const soyadInput = screen.getByLabelText("Soyad*");
    userEvent.type(soyadInput, 'Mansız');
  
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, 'melih@gmail.com');
    
    const mesajInput = screen.getByLabelText(/mesaj*/i);
    userEvent.type(mesajInput, 'Merhaba');

    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
        const ad= screen.queryByText('Melih');
        expect(ad).toBeInTheDocument();

        const soyad= screen.queryByText(/Mansız/i);
        expect(soyad).toBeInTheDocument();

        const email= screen.queryByTestId("emailDisplay");
        expect(email).toHaveTextContent('melih@gmail.com');

        const mesaj= screen.queryByText(/Merhaba/i);
        expect(mesaj).toBeInTheDocument();

    });

});
