namespace react_opdract;

using System.Net.Sockets;
using System.Linq;
using System;
using System.IO;
using System.Collections.Generic;

class Program
{
    static void Main(string[] args)
    {
        var Boekingen = new List<(int dag, int aantal, string email)>();
        TcpListener server = new TcpListener(new System.Net.IPAddress(new byte[] { 127, 0, 0, 1 }), 5000);
        server.Start();
        while (true)
        {
            Console.Write(Boekingen);
            using Socket connectie = server.AcceptSocket();
            using Stream request = new NetworkStream(connectie);
            using StreamReader requestLezer = new StreamReader(request);
            string[]? regel1 = requestLezer.ReadLine()?.Split(" ");
            if (regel1 == null) continue;
            (string methode, string url, string httpversie) = (regel1[0], regel1[1], regel1[2]);
            string? regel = requestLezer.ReadLine();
            int contentLength = 0;
            while (!string.IsNullOrEmpty(regel) && !requestLezer.EndOfStream)
            {
                string[] stukjes = regel.Split(":");
                (string header, string waarde) = (stukjes[0], stukjes[1]);
                if (header.ToLower() == "content-length")
                    contentLength = int.Parse(waarde);
                regel = requestLezer.ReadLine();
            }
            if (contentLength > 0)
            {
                char[] bytes = new char[(int)contentLength];
                requestLezer.Read(bytes, 0, (int)contentLength);
            }
            url = url.Trim('/');
            string? file = null;
            string Status = "200 OK";
            string? content = null;
            if (url == "")
                file = "index.html";
            else if (url == "boek")
                file = "boek.html";
            else if (url.StartsWith("doeboeking"))
            {
                Console.Write("Doe Boeking");
                var query = url.Split("?")[1].Split("&");
                int? aantal = null;
                int? dag = null;
                string? email = null;
                foreach (string q in query)
                {
                    var sleutel = q.Split("=")[0];
                    var waarde = q.Split("=")[1];
                    if (sleutel == "aantal") aantal = int.Parse(waarde);
                    if (sleutel == "dag") dag = int.Parse(waarde);
                    if (sleutel == "email") email = waarde;
                }
                if (!email.Contains("@"))
                {
                    content = "Email adres is niet valide";
                    connectie.Send(System.Text.Encoding.ASCII.GetBytes("HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\nContent-Length: " + content.Length + "\r\n\r\n" +
                        content));
                    continue;
                }
                if (aantal == null)
                {
                    content = "Aantal is verplicht";
                    connectie.Send(System.Text.Encoding.ASCII.GetBytes("HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\nContent-Length: " + content.Length + "\r\n\r\n" + content));
                    continue;
                }
                int[] aantalenPerDag = new int[14];
                foreach (var b in Boekingen)
                {
                    aantalenPerDag[b.dag] += b.aantal;
                }
                if (aantalenPerDag[dag.Value] + aantal.Value > 10)
                {
                    content = "De gekozen dag is al vol";
                    connectie.Send(System.Text.Encoding.ASCII.GetBytes("HTTP/1.0 400 Bad Request\r\nContent-Type: text/html\r\nContent-Length: " + content.Length + "\r\n\r\n" + content));
                    continue;
                }
                Boekingen.Add((dag!.Value, aantal!.Value, email!));
                content = "Boeking gelukt! Klik niet op F5, want dan wordt de boeking opnieuw gedaan. ";
            }
            if (file != null)
                content = File.ReadAllText(file).Replace("DAGEN", "1,2,3,4,5,6,7,8,9,10,11,12,13,14");
            if (content == null)
                connectie.Send(System.Text.Encoding.ASCII.GetBytes("HTTP/1.0 404 Not Found\r\nContent-Type: text/html\r\nContent-Length: 0\r\n\r\n"));
            else
                connectie.Send(System.Text.Encoding.ASCII.GetBytes("HTTP/1.0 " + Status + "\r\nContent-Type: text/html\r\nContent-Length: " + content.Length + "\r\n\r\n" + content));
        }
    }
}